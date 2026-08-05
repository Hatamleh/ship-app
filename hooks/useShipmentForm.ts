import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import type { CardRules, ServiceOption, ShipmentType } from '@/lib/types'
import { t } from '@/lib/translations'

export function useShipmentForm(editId?: string | null, repeatId?: string | null) {
  const router = useRouter()
  const { user } = useAuth()

  // State
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isEditMode] = useState(!!editId)
  const [shipmentId] = useState<number | null>(
    editId ? parseInt(editId) : repeatId ? parseInt(repeatId) : null
  )

  // Card rules
  const [senderRules, setSenderRules] = useState<CardRules | null>(null)
  const [receiverRules, setReceiverRules] = useState<CardRules | null>(null)
  const [packageRules, setPackageRules] = useState<any>(null)
  const [serviceRules, setServiceRules] = useState<any>(null)
  const [additionalOptionsRules, setAdditionalOptionsRules] = useState<any>(null)

  // Card completion tracking
  const [senderCompleted, setSenderCompleted] = useState(false)
  const [receiverCompleted, setReceiverCompleted] = useState(false)
  const [packageCompleted, setPackageCompleted] = useState(false)

  // Shipment data
  const [shipmentType, setShipmentType] = useState<ShipmentType | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null)
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)
  const [rateBreakdown, setRateBreakdown] = useState<any>(null)

  // Form data
  const [formData, setFormData] = useState<Record<string, any>>({
    senderName: '',
    senderPhone: '',
    senderCountry: '',
    senderCity: '',
    senderStreet: '',
    senderPostalCode: '',
    receiverName: '',
    receiverPhone: '',
    receiverCountry: '',
    receiverCity: '',
    receiverStreet: '',
    receiverPostalCode: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    itemDescription: '',
    serviceType: '',
    signatureRequired: false,
    containsLiquid: false,
    insurance: false,
    packaging: false,
    pickupMethod: 'home',
  })

  // Refs to track previous values and prevent redundant API calls
  const prevSenderCountryRef = useRef<string>('')
  const prevReceiverCountryRef = useRef<string>('')
  const prevWeightRef = useRef<string>('')
  const prevShipmentTypeRef = useRef<ShipmentType | null>(null)
  const prevReceiverCompletedRef = useRef<boolean>(false)
  const prevPackageCompletedRef = useRef<boolean>(false)

  // Pre-fill user data when user is loaded from context
  useEffect(() => {
    if (!user) return

    // Pre-fill sender data from user info (only if not in edit mode)
    if (!isEditMode) {
      setFormData((prev) => ({
        ...prev,
        senderName: user.fullName,
        senderPhone: user.phone,
        senderCountry: user.country,
        senderCity: user.city,
        senderStreet: user.street,
        senderPostalCode: user.postalCode,
      }))

      // Mark sender as completed since user data is pre-filled
      setSenderCompleted(true)
    }
  }, [user, isEditMode])

  const loadShipment = async () => {
    if (!shipmentId) return

    try {
      const response = await fetch(`/api/shipments/${shipmentId}`)

      if (!response.ok) {
        if (response.status === 404) {
          setErrors({ general: 'Shipment not found' })
          return
        }
        throw new Error('Failed to load shipment')
      }

      const data = await response.json()
      const shipment = data.shipment

      // Pre-fill all form fields with shipment data
      // The API returns a nested structure (from/to/package/service/options)
      setFormData({
        // From (Sender)
        senderName: shipment.from?.name || '',
        senderPhone: shipment.from?.phone || '',
        senderCountry: shipment.from?.country || '',
        senderCity: shipment.from?.city || '',
        senderStreet: shipment.from?.street || '',
        senderPostalCode: shipment.from?.postalCode || '',
        // To (Receiver)
        receiverName: shipment.to?.name || '',
        receiverPhone: shipment.to?.phone || '',
        receiverCountry: shipment.to?.country || '',
        receiverCity: shipment.to?.city || '',
        receiverStreet: shipment.to?.street || '',
        receiverPostalCode: shipment.to?.postalCode || '',
        // Package
        weight: shipment.package?.weight?.toString() || '',
        length: shipment.package?.length?.toString() || '',
        width: shipment.package?.width?.toString() || '',
        height: shipment.package?.height?.toString() || '',
        itemDescription: shipment.package?.description || '',
        // Service
        serviceType: shipment.service?.type || '',
        pickupMethod: shipment.service?.pickupMethod || 'home',
        // Options
        signatureRequired: shipment.options?.signature || false,
        containsLiquid: shipment.options?.liquid || false,
        insurance: shipment.options?.insurance || false,
        packaging: shipment.options?.packaging || false,
      })

      // The rules system and completion tracking will handle the rest
    } catch (error) {
      console.error('Error loading shipment:', error)
      setErrors({ general: error instanceof Error ? error.message : 'Failed to load shipment' })
    }
  }

  const loadSenderRules = async () => {
    try {
      const response = await fetch('/api/rules/sender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: { country: formData.senderCountry },
        }),
      })
      const rules = await response.json()
      setSenderRules(rules)
    } catch (error) {
      console.error('Error loading sender rules:', error)
    }
  }

  const loadReceiverRules = async () => {
    try {
      const response = await fetch('/api/rules/receiver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: { country: formData.senderCountry },
          to: { country: formData.receiverCountry },
        }),
      })
      const rules = await response.json()
      setReceiverRules(rules)

      if (rules.validationErrors && Object.keys(rules.validationErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...rules.validationErrors }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          Object.keys(newErrors).forEach((key) => {
            if (newErrors[key] === t('errors.gulfToIraqNotAllowed')) {
              delete newErrors[key]
            }
          })
          return newErrors
        })
      }
    } catch (error) {
      console.error('Error loading receiver rules:', error)
    }
  }

  const loadPackageRules = async () => {
    try {
      const response = await fetch('/api/rules/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: { country: formData.senderCountry },
          to: { country: formData.receiverCountry },
        }),
      })
      const rules = await response.json()
      setPackageRules(rules)
      setShipmentType(rules.shipmentType)
    } catch (error) {
      console.error('Error loading package rules:', error)
    }
  }

  const loadServiceRules = async () => {
    try {
      const response = await fetch('/api/rules/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipmentType,
          package: { weight: formData.weight },
        }),
      })
      const rules = await response.json()
      setServiceRules(rules)
    } catch (error) {
      console.error('Error loading service rules:', error)
    }
  }

  const loadAdditionalOptionsRules = async () => {
    try {
      const response = await fetch('/api/rules/additional-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: { country: formData.senderCountry },
          to: { country: formData.receiverCountry },
          package: { weight: formData.weight },
        }),
      })
      const rules = await response.json()
      setAdditionalOptionsRules(rules)

      // Auto-apply rules
      if (rules.fields?.signatureRequired?.checked) {
        setFormData((prev) => ({ ...prev, signatureRequired: true }))
      }
      if (
        rules.fields?.pickupMethod?.defaultValue &&
        rules.fields?.pickupMethod?.disabledValues?.includes(formData.pickupMethod)
      ) {
        setFormData((prev) => ({
          ...prev,
          pickupMethod: rules.fields.pickupMethod.defaultValue,
        }))
      }
    } catch (error) {
      console.error('Error loading additional options rules:', error)
    }
  }

  const loadRate = async () => {
    if (!selectedService) return

    try {
      const response = await fetch('/api/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          weight: parseFloat(formData.weight),
          senderCountry: formData.senderCountry,
          receiverCountry: formData.receiverCountry,
          pickupMethod: formData.pickupMethod,
          signatureRequired: formData.signatureRequired,
          containsLiquid: formData.containsLiquid,
          insurance: formData.insurance,
          packaging: formData.packaging,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to calculate rate')
      }

      const data = await response.json()
      setCalculatedPrice(data.totalPrice)
      setRateBreakdown(data.breakdown)
    } catch (error) {
      console.error('Error calculating rate:', error)
      setCalculatedPrice(null)
      setRateBreakdown(null)
    }
  }

  // Validation helpers
  const checkCardComplete = (rules: CardRules, data: Record<string, any>): boolean => {
    return Object.entries(rules.fields).every(([fieldName, field]) => {
      if (!field.required) return true
      const value = data[fieldName]
      if (typeof value === 'string') return value.trim().length > 0
      return value !== null && value !== undefined && value !== ''
    })
  }

  const checkPackageComplete = (): boolean => {
    const requiredFields = ['weight', 'length', 'width', 'height']
    return requiredFields.every((field) => {
      const value = formData[field]
      const num = parseFloat(value)
      return !isNaN(num) && num > 0
    })
  }

  const validateField = (fieldName: string, fieldRule: any, value: any): string | null => {
    // Required validation
    if (fieldRule.required) {
      if (typeof value === 'string' && value.trim() === '') {
        return fieldRule.validation?.errorMessage || 'This field is required'
      }
      if (value === null || value === undefined || value === '') {
        return fieldRule.validation?.errorMessage || 'This field is required'
      }
    }

    // Phone number validation - count only digits
    const isPhoneField = fieldName.toLowerCase().includes('phone')
    const checkLength = isPhoneField && value ? value.replace(/\D/g, '').length : value?.length || 0

    // MinLength validation
    if (fieldRule.validation?.minLength && value) {
      if (checkLength < fieldRule.validation.minLength) {
        return isPhoneField
          ? `Phone number must be at least ${fieldRule.validation.minLength} digits`
          : `Minimum ${fieldRule.validation.minLength} characters`
      }
    }

    // MaxLength validation
    if (fieldRule.validation?.maxLength && value) {
      if (checkLength > fieldRule.validation.maxLength) {
        return isPhoneField
          ? `Phone number cannot exceed ${fieldRule.validation.maxLength} digits`
          : `Maximum ${fieldRule.validation.maxLength} characters`
      }
    }

    // Pattern validation
    if (fieldRule.validation?.pattern && value) {
      const regex = new RegExp(fieldRule.validation.pattern)
      if (!regex.test(value)) {
        return fieldRule.validation?.errorMessage || 'Invalid format'
      }
    }

    // Number validations
    if (fieldRule.type === 'number' && value) {
      const numValue = parseFloat(value)
      if (isNaN(numValue)) return 'Please enter a valid number'
      if (fieldRule.validation?.min !== undefined && numValue < fieldRule.validation.min) {
        return `Value must be at least ${fieldRule.validation.min}`
      }
      if (fieldRule.validation?.max !== undefined && numValue > fieldRule.validation.max) {
        return `Value cannot exceed ${fieldRule.validation.max}`
      }
    }

    return null
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate sender
    if (senderRules) {
      Object.entries(senderRules.fields).forEach(([fieldName, field]) => {
        if (field.required && !formData[fieldName]) {
          newErrors[fieldName] = field.validation?.errorMessage || 'Required'
        }
      })
    }

    // Validate receiver
    if (receiverRules) {
      Object.entries(receiverRules.fields).forEach(([fieldName, field]) => {
        if (field.required && !formData[fieldName]) {
          newErrors[fieldName] = field.validation?.errorMessage || 'Required'
        }
      })
      if (receiverRules.validationErrors) {
        Object.assign(newErrors, receiverRules.validationErrors)
      }
    }

    // Validate package
    if (packageRules) {
      const weight = parseFloat(formData.weight)
      if (isNaN(weight) || weight <= 0) {
        newErrors.weight = 'Weight is required'
      } else if (weight > packageRules.maxWeight) {
        newErrors.weight = `Weight cannot exceed ${packageRules.maxWeight} kg`
      }
    }

    // Validate service selected
    if (!selectedService) {
      newErrors.service = 'Please select a service'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handlers
  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }

  const handleFieldBlur = (fieldName: string) => {
    const allRules: Record<string, any> = {}
    if (senderRules?.fields) Object.assign(allRules, senderRules.fields)
    if (receiverRules?.fields) Object.assign(allRules, receiverRules.fields)
    if (packageRules?.fields) Object.assign(allRules, packageRules.fields)

    const fieldRule = allRules[fieldName]
    if (!fieldRule) return

    const value = formData[fieldName]
    const error = validateField(fieldName, fieldRule, value)

    if (error) {
      setErrors((prev) => ({ ...prev, [fieldName]: error }))
    } else {
      // Don't clear API validation errors
      if (fieldName === 'receiverCountry' && receiverRules?.validationErrors?.[fieldName]) {
        return
      }
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const handleServiceSelect = (service: ServiceOption) => {
    setSelectedService(service)
    setFormData((prev) => ({ ...prev, serviceType: service.id }))
  }

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault()

    if (isDraft) {
      // Save as draft directly
      await createShipment(true)
    } else {
      // Finalize: Validate and create shipment
      if (!validateForm()) return
      await createShipment(false)
    }
  }

  const createShipment = async (isDraft: boolean = false) => {
    setLoading(true)
    try {
      // Transform flat formData to new nested structure
      const requestBody = {
        from: {
          name: formData.senderName,
          phone: formData.senderPhone,
          country: formData.senderCountry,
          city: formData.senderCity,
          street: formData.senderStreet,
          postalCode: formData.senderPostalCode,
        },
        to: {
          name: formData.receiverName,
          phone: formData.receiverPhone,
          country: formData.receiverCountry,
          city: formData.receiverCity,
          street: formData.receiverStreet,
          postalCode: formData.receiverPostalCode,
        },
        package: {
          weight: parseFloat(formData.weight) || 0,
          length: parseFloat(formData.length) || 0,
          width: parseFloat(formData.width) || 0,
          height: parseFloat(formData.height) || 0,
          description: formData.itemDescription || '',
        },
        service: {
          type: formData.serviceType,
          pickupMethod: formData.pickupMethod,
          shipmentType: shipmentType || 'Domestic',
        },
        additional: {
          signature: formData.signatureRequired,
          liquid: formData.containsLiquid,
          insurance: formData.insurance,
          packaging: formData.packaging,
        },
        rates: {
          base: rateBreakdown?.baseCost || 0,
          insurance: rateBreakdown?.insuranceCost || 0,
          signature: rateBreakdown?.signatureCost || 0,
          packaging: rateBreakdown?.packagingCost || 0,
          total: calculatedPrice || 0,
        },
      }

      // Determine URL and method based on edit mode and draft status
      let url: string
      let method: string

      if (isEditMode && shipmentId) {
        // Edit mode: use PUT to update existing shipment
        url = `/api/shipments/${shipmentId}`
        method = 'PUT'
      } else {
        // Create mode: use separate draft/finalize endpoints
        url = isDraft ? '/api/shipments/draft' : '/api/shipments/finalize'
        method = 'POST'
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const error = await response.json()

        // If there are validation errors from backend, show them in the form
        if (error.validationErrors && typeof error.validationErrors === 'object') {
          setErrors(error.validationErrors)
          throw new Error(error.message || 'Please correct the errors in the form')
        }

        // If there are validation details, format them nicely
        if (error.details && Array.isArray(error.details)) {
          const errorMsg = `${error.error}: ${error.details.join(', ')}`
          throw new Error(errorMsg)
        }

        throw new Error(error.error || `Failed to ${isEditMode ? 'update' : 'create'} shipment`)
      }

      // Redirect to shipments list
      router.push('/shipments')
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} shipment:`, error)
      throw error
    } finally {
      setLoading(false)
    }
  }


  // Effects - Load shipment data in edit/repeat mode
  useEffect(() => {
    // Load shipment data if in edit or repeat mode
    if (shipmentId && (isEditMode || repeatId)) {
      loadShipment()
    }
    // Note: No need to call loadSenderRules() here, the optimized useEffect will handle it
    // when formData is populated (either from user pre-fill or from loadShipment)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Check sender completion
  useEffect(() => {
    if (senderRules) {
      const isComplete = checkCardComplete(senderRules, formData)
      if (isComplete && !senderCompleted) {
        setSenderCompleted(true)
      } else if (!isComplete && senderCompleted) {
        setSenderCompleted(false)
        setReceiverCompleted(false)
        setPackageCompleted(false)
        setReceiverRules(null)
        setPackageRules(null)
        setAdditionalOptionsRules(null)
        setServiceRules(null)
        setShipmentType(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, senderRules, senderCompleted])

  // Check receiver completion
  useEffect(() => {
    if (receiverRules && senderCompleted) {
      const isComplete = checkCardComplete(receiverRules, formData)
      const hasValidationErrors =
        receiverRules.validationErrors && Object.keys(receiverRules.validationErrors).length > 0

      if (isComplete && !hasValidationErrors && !receiverCompleted) {
        setReceiverCompleted(true)
        // Note: loadPackageRules() removed - optimized useEffect will handle it
      } else if ((!isComplete || hasValidationErrors) && receiverCompleted) {
        setReceiverCompleted(false)
        setPackageCompleted(false)
        setPackageRules(null)
        setAdditionalOptionsRules(null)
        setServiceRules(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, receiverRules, senderCompleted, receiverCompleted])

  // Check package completion
  useEffect(() => {
    if (packageRules && receiverCompleted) {
      const isComplete = checkCardComplete(packageRules, formData) && checkPackageComplete()
      if (isComplete && !packageCompleted) {
        setPackageCompleted(true)
        // Note: loadServiceRules() and loadAdditionalOptionsRules() removed - optimized useEffect will handle them
      } else if (!isComplete && packageCompleted) {
        setPackageCompleted(false)
        setServiceRules(null)
        setAdditionalOptionsRules(null)
        setSelectedService(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, packageRules, receiverCompleted, packageCompleted])

  // Calculate price via API when service is selected or dependencies change
  useEffect(() => {
    if (selectedService) {
      loadRate()
    } else {
      setCalculatedPrice(null)
      setRateBreakdown(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedService,
    formData.weight,
    formData.senderCountry,
    formData.receiverCountry,
    formData.pickupMethod,
    formData.signatureRequired,
    formData.containsLiquid,
    formData.insurance,
    formData.packaging,
  ])

  // Optimized: Smart reloading of rules when relevant data changes
  useEffect(() => {
    const senderCountryChanged = formData.senderCountry !== prevSenderCountryRef.current
    const receiverCountryChanged = formData.receiverCountry !== prevReceiverCountryRef.current
    const weightChanged = formData.weight !== prevWeightRef.current
    const shipmentTypeChanged = shipmentType !== prevShipmentTypeRef.current
    const receiverCompletedChanged = receiverCompleted !== prevReceiverCompletedRef.current
    const packageCompletedChanged = packageCompleted !== prevPackageCompletedRef.current

    // Special case: In edit/repeat mode, load all rules when data is first populated
    const isInitialLoad = prevSenderCountryRef.current === '' && formData.senderCountry !== ''
    const inRepeatOrEditMode = isEditMode || repeatId

    // Reload sender rules only if sender country changed
    if (senderCountryChanged && formData.senderCountry) {
      loadSenderRules()
    }

    // Reload receiver rules if sender or receiver country changed
    if ((senderCountryChanged || receiverCountryChanged) && (formData.senderCountry || formData.receiverCountry)) {
      if (senderCompleted || formData.receiverCountry || (isInitialLoad && inRepeatOrEditMode)) {
        loadReceiverRules()
      }
    }

    // Reload package rules if countries changed OR when receiver becomes completed
    if ((senderCountryChanged || receiverCountryChanged || receiverCompletedChanged)) {
      if ((receiverCompleted && formData.senderCountry && formData.receiverCountry) ||
          (isInitialLoad && inRepeatOrEditMode && formData.senderCountry && formData.receiverCountry)) {
        loadPackageRules()
      }
    }

    // Reload service rules if relevant data changed OR when package becomes completed
    if (shipmentType && formData.weight) {
      if ((packageCompleted && (senderCountryChanged || receiverCountryChanged || weightChanged || shipmentTypeChanged || packageCompletedChanged)) ||
          (isInitialLoad && inRepeatOrEditMode)) {
        loadServiceRules()
      }
    }

    // Reload additional options if relevant data changed OR when package becomes completed
    if (packageCompleted || (isInitialLoad && inRepeatOrEditMode)) {
      if (senderCountryChanged || receiverCountryChanged || weightChanged || packageCompletedChanged || (isInitialLoad && inRepeatOrEditMode)) {
        loadAdditionalOptionsRules()
      }
    }

    // Update refs with current values
    prevSenderCountryRef.current = formData.senderCountry
    prevReceiverCountryRef.current = formData.receiverCountry
    prevWeightRef.current = formData.weight
    prevShipmentTypeRef.current = shipmentType
    prevReceiverCompletedRef.current = receiverCompleted
    prevPackageCompletedRef.current = packageCompleted

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.senderCountry,
    formData.receiverCountry,
    formData.weight,
    shipmentType,
    senderCompleted,
    receiverCompleted,
    packageCompleted,
  ])

  // In edit or repeat mode, set the selected service when serviceRules loads
  useEffect(() => {
    if ((isEditMode || repeatId) && serviceRules && formData.serviceType && !selectedService) {
      // Find the matching service from available services
      const matchingService = serviceRules.services?.find(
        (service: ServiceOption) => service.id === formData.serviceType
      )
      if (matchingService) {
        setSelectedService(matchingService)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceRules, isEditMode, repeatId])

  return {
    // State
    loading,
    errors,
    formData,
    isEditMode,
    // Rules
    senderRules,
    receiverRules,
    packageRules,
    serviceRules,
    additionalOptionsRules,
    // Completion
    senderCompleted,
    receiverCompleted,
    packageCompleted,
    // Shipment
    shipmentType,
    selectedService,
    calculatedPrice,
    rateBreakdown,
    // Handlers
    handleFieldChange,
    handleFieldBlur,
    handleServiceSelect,
    handleSubmit,
  }
}
