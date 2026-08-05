import { goto } from '$app/navigation'
import type { CardRules, ServiceOption, ShipmentType, User } from '$lib/types'

/**
 * State for the progressive shipment form.
 *
 * The React version tracked card completion in useState and synced it with
 * useEffect, then needed six "previous value" refs to stop redundant API calls.
 * Here completion is $derived, and each $effect re-runs only when a value it
 * actually reads changes — so both the sync effects and the refs are gone.
 */

const EMPTY_FORM = {
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
} as Record<string, any>

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return response.json()
}

/** A card counts as complete when every required field it declares has a value. */
function cardComplete(rules: CardRules | null, data: Record<string, any>): boolean {
  if (!rules?.fields) return false
  return Object.entries(rules.fields).every(([name, field]) => {
    if (!field.required) return true
    const value = data[name]
    if (typeof value === 'string') return value.trim().length > 0
    return value !== null && value !== undefined && value !== ''
  })
}

export class ShipmentForm {
  form = $state({ ...EMPTY_FORM })
  errors = $state<Record<string, string>>({})
  loading = $state(false)
  submitError = $state<string | null>(null)

  senderRules = $state<CardRules | null>(null)
  receiverRules = $state<any>(null)
  packageRules = $state<any>(null)
  serviceRules = $state<any>(null)
  additionalOptionsRules = $state<any>(null)

  shipmentType = $state<ShipmentType | null>(null)
  selectedService = $state<ServiceOption | null>(null)
  calculatedPrice = $state<number | null>(null)
  rateBreakdown = $state<any>(null)

  readonly isEditMode: boolean
  readonly shipmentId: number | null
  #hydrating = false

  // Completion cascades automatically: if the sender card becomes incomplete,
  // receiverCompleted and packageCompleted both fall to false on their own.
  senderCompleted = $derived(cardComplete(this.senderRules, this.form))

  receiverCompleted = $derived(
    this.senderCompleted &&
      cardComplete(this.receiverRules, this.form) &&
      Object.keys(this.receiverRules?.validationErrors ?? {}).length === 0
  )

  packageCompleted = $derived(
    this.receiverCompleted &&
      cardComplete(this.packageRules, this.form) &&
      ['weight', 'length', 'width', 'height'].every((f) => {
        const n = parseFloat(this.form[f])
        return !isNaN(n) && n > 0
      })
  )

  constructor(user: User | null, editId?: string | null, repeatId?: string | null) {
    this.isEditMode = !!editId
    this.shipmentId = editId ? parseInt(editId) : repeatId ? parseInt(repeatId) : null

    // Prefill the sender from the signed-in user, unless we are loading an
    // existing shipment which carries its own sender details.
    if (user && !this.shipmentId) {
      Object.assign(this.form, {
        senderName: user.fullName,
        senderPhone: user.phone,
        senderCountry: user.country,
        senderCity: user.city,
        senderStreet: user.street,
        senderPostalCode: user.postalCode,
      })
    }

    if (this.shipmentId) {
      this.#hydrating = true
      void this.#loadShipment()
    }

    // Each effect below reads exactly the values it depends on, so Svelte
    // re-runs it only when those change. No manual change detection.

    $effect(() => {
      const country = this.form.senderCountry
      if (!country) return
      void this.#loadSenderRules(country)
    })

    $effect(() => {
      const from = this.form.senderCountry
      const to = this.form.receiverCountry
      if (!from) return
      void this.#loadReceiverRules(from, to)
    })

    $effect(() => {
      const from = this.form.senderCountry
      const to = this.form.receiverCountry
      if (!this.receiverCompleted || !from || !to) return
      void this.#loadPackageRules(from, to)
    })

    $effect(() => {
      const type = this.shipmentType
      const weight = this.form.weight
      if (!this.packageCompleted || !type || !weight) return
      void this.#loadServiceRules(type, weight)
    })

    $effect(() => {
      const from = this.form.senderCountry
      const to = this.form.receiverCountry
      const weight = this.form.weight
      if (!this.packageCompleted) return
      void this.#loadAdditionalOptions(from, to, weight)
    })

    // Re-price whenever the service or any pricing input changes.
    $effect(() => {
      const service = this.selectedService
      const inputs = {
        weight: this.form.weight,
        senderCountry: this.form.senderCountry,
        receiverCountry: this.form.receiverCountry,
        pickupMethod: this.form.pickupMethod,
        signatureRequired: this.form.signatureRequired,
        containsLiquid: this.form.containsLiquid,
        insurance: this.form.insurance,
        packaging: this.form.packaging,
      }

      if (!service) {
        this.calculatedPrice = null
        this.rateBreakdown = null
        return
      }

      void this.#loadRate(service, inputs)
    })
  }

  // ---------- loading ----------

  async #loadShipment() {
    try {
      const response = await fetch(`/api/shipments/${this.shipmentId}`)
      if (!response.ok) {
        this.errors = { general: response.status === 404 ? 'Shipment not found' : 'Failed to load shipment' }
        return
      }

      const { shipment } = await response.json()

      Object.assign(this.form, {
        senderName: shipment.from?.name ?? '',
        senderPhone: shipment.from?.phone ?? '',
        senderCountry: shipment.from?.country ?? '',
        senderCity: shipment.from?.city ?? '',
        senderStreet: shipment.from?.street ?? '',
        senderPostalCode: shipment.from?.postalCode ?? '',
        receiverName: shipment.to?.name ?? '',
        receiverPhone: shipment.to?.phone ?? '',
        receiverCountry: shipment.to?.country ?? '',
        receiverCity: shipment.to?.city ?? '',
        receiverStreet: shipment.to?.street ?? '',
        receiverPostalCode: shipment.to?.postalCode ?? '',
        weight: shipment.package?.weight?.toString() ?? '',
        length: shipment.package?.length?.toString() ?? '',
        width: shipment.package?.width?.toString() ?? '',
        height: shipment.package?.height?.toString() ?? '',
        itemDescription: shipment.package?.description ?? '',
        serviceType: shipment.service?.type ?? '',
        pickupMethod: shipment.service?.pickupMethod ?? 'home',
        signatureRequired: shipment.options?.signature ?? false,
        containsLiquid: shipment.options?.liquid ?? false,
        insurance: shipment.options?.insurance ?? false,
        packaging: shipment.options?.packaging ?? false,
      })
    } catch (err) {
      console.error('Error loading shipment:', err)
      this.errors = { general: 'Failed to load shipment' }
    } finally {
      this.#hydrating = false
    }
  }

  async #loadSenderRules(country: string) {
    try {
      this.senderRules = await postJson('/api/rules/sender', { from: { country } })
    } catch (err) {
      console.error('Error loading sender rules:', err)
    }
  }

  async #loadReceiverRules(from: string, to: string) {
    try {
      const rules = await postJson('/api/rules/receiver', {
        from: { country: from },
        to: { country: to },
      })
      this.receiverRules = rules

      // Surface server-side rule violations (Gulf -> Iraq) on the field, and
      // clear them again once the route becomes valid.
      const violations: Record<string, string> = rules.validationErrors ?? {}
      const next = { ...this.errors }
      delete next.receiverCountry
      this.errors = { ...next, ...violations }
    } catch (err) {
      console.error('Error loading receiver rules:', err)
    }
  }

  async #loadPackageRules(from: string, to: string) {
    try {
      const rules = await postJson('/api/rules/package', {
        from: { country: from },
        to: { country: to },
      })
      this.packageRules = rules
      this.shipmentType = rules.shipmentType
    } catch (err) {
      console.error('Error loading package rules:', err)
    }
  }

  async #loadServiceRules(shipmentType: ShipmentType, weight: string) {
    try {
      const rules = await postJson('/api/rules/service', {
        shipmentType,
        package: { weight },
      })
      this.serviceRules = rules

      // When editing or repeating, reselect the shipment's saved service once
      // the list it belongs to has loaded.
      if (this.shipmentId && this.form.serviceType && !this.selectedService) {
        const match = rules.services?.find((s: ServiceOption) => s.id === this.form.serviceType)
        if (match) this.selectedService = match
      }

      // A service that is no longer offered (weight went up) must not stay selected.
      if (
        this.selectedService &&
        !rules.services?.some((s: ServiceOption) => s.id === this.selectedService!.id)
      ) {
        this.selectedService = null
        this.form.serviceType = ''
      }
    } catch (err) {
      console.error('Error loading service rules:', err)
    }
  }

  async #loadAdditionalOptions(from: string, to: string, weight: string) {
    try {
      const rules = await postJson('/api/rules/additional-options', {
        from: { country: from },
        to: { country: to },
        package: { weight },
      })
      this.additionalOptionsRules = rules

      // Apply forced options: mandatory signature, and pickup method being
      // taken away above the weight limit.
      if (rules.fields?.signatureRequired?.checked) {
        this.form.signatureRequired = true
      }
      const pickup = rules.fields?.pickupMethod
      if (pickup?.disabledValues?.includes(this.form.pickupMethod)) {
        this.form.pickupMethod = pickup.defaultValue
      }
    } catch (err) {
      console.error('Error loading additional options rules:', err)
    }
  }

  async #loadRate(service: ServiceOption, inputs: Record<string, any>) {
    try {
      const response = await fetch('/api/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: service.id, ...inputs, weight: parseFloat(inputs.weight) }),
      })

      if (!response.ok) {
        this.calculatedPrice = null
        this.rateBreakdown = null
        return
      }

      const data = await response.json()
      this.calculatedPrice = data.totalPrice
      this.rateBreakdown = data.breakdown
    } catch (err) {
      console.error('Error calculating rate:', err)
      this.calculatedPrice = null
      this.rateBreakdown = null
    }
  }

  // ---------- field handling ----------

  setField(name: string, value: any) {
    this.form[name] = value
    if (this.errors[name]) {
      const next = { ...this.errors }
      delete next[name]
      this.errors = next
    }
  }

  validateField(name: string, rule: any, value: any): string | null {
    if (rule.required) {
      if (value === null || value === undefined || value === '') {
        return rule.validation?.errorMessage || 'This field is required'
      }
      if (typeof value === 'string' && value.trim() === '') {
        return rule.validation?.errorMessage || 'This field is required'
      }
    }

    // Phone length is measured in digits, ignoring separators.
    const isPhone = name.toLowerCase().includes('phone')
    const length = isPhone && value ? String(value).replace(/\D/g, '').length : String(value ?? '').length

    if (rule.validation?.minLength && value && length < rule.validation.minLength) {
      return isPhone
        ? `Phone number must be at least ${rule.validation.minLength} digits`
        : `Minimum ${rule.validation.minLength} characters`
    }

    if (rule.validation?.maxLength && value && length > rule.validation.maxLength) {
      return isPhone
        ? `Phone number cannot exceed ${rule.validation.maxLength} digits`
        : `Maximum ${rule.validation.maxLength} characters`
    }

    if (rule.validation?.pattern && value && !new RegExp(rule.validation.pattern).test(value)) {
      return rule.validation?.errorMessage || 'Invalid format'
    }

    if (rule.type === 'number' && value !== '' && value !== null && value !== undefined) {
      const num = parseFloat(value)
      if (isNaN(num)) return 'Please enter a valid number'
      if (rule.validation?.min !== undefined && num < rule.validation.min) {
        return `Value must be at least ${rule.validation.min}`
      }
      if (rule.validation?.max !== undefined && num > rule.validation.max) {
        return `Value cannot exceed ${rule.validation.max}`
      }
    }

    return null
  }

  blurField(name: string) {
    const rules: Record<string, any> = {
      ...(this.senderRules?.fields ?? {}),
      ...(this.receiverRules?.fields ?? {}),
      ...(this.packageRules?.fields ?? {}),
    }

    const rule = rules[name]
    if (!rule) return

    const error = this.validateField(name, rule, this.form[name])

    if (error) {
      this.errors = { ...this.errors, [name]: error }
      return
    }

    // A rule violation reported by the server outranks local field validation.
    if (this.receiverRules?.validationErrors?.[name]) return

    const next = { ...this.errors }
    delete next[name]
    this.errors = next
  }

  selectService(service: ServiceOption) {
    this.selectedService = service
    this.form.serviceType = service.id
  }

  // ---------- submission ----------

  #validateAll(): boolean {
    const errors: Record<string, string> = {}

    for (const rules of [this.senderRules, this.receiverRules]) {
      for (const [name, field] of Object.entries<any>(rules?.fields ?? {})) {
        if (field.required && !this.form[name]) {
          errors[name] = field.validation?.errorMessage || 'Required'
        }
      }
    }

    Object.assign(errors, this.receiverRules?.validationErrors ?? {})

    if (this.packageRules) {
      const weight = parseFloat(this.form.weight)
      if (isNaN(weight) || weight <= 0) {
        errors.weight = 'Weight is required'
      } else if (weight > this.packageRules.maxWeight) {
        errors.weight = `Weight cannot exceed ${this.packageRules.maxWeight} kg`
      }
    }

    if (!this.selectedService) {
      errors.service = 'Please select a service'
    }

    this.errors = errors
    return Object.keys(errors).length === 0
  }

  #payload() {
    return {
      from: {
        name: this.form.senderName,
        phone: this.form.senderPhone,
        country: this.form.senderCountry,
        city: this.form.senderCity,
        street: this.form.senderStreet,
        postalCode: this.form.senderPostalCode,
      },
      to: {
        name: this.form.receiverName,
        phone: this.form.receiverPhone,
        country: this.form.receiverCountry,
        city: this.form.receiverCity,
        street: this.form.receiverStreet,
        postalCode: this.form.receiverPostalCode,
      },
      package: {
        weight: parseFloat(this.form.weight) || 0,
        length: parseFloat(this.form.length) || 0,
        width: parseFloat(this.form.width) || 0,
        height: parseFloat(this.form.height) || 0,
        description: this.form.itemDescription || '',
      },
      service: {
        type: this.form.serviceType,
        pickupMethod: this.form.pickupMethod,
        shipmentType: this.shipmentType || 'Domestic',
      },
      additional: {
        signature: this.form.signatureRequired,
        liquid: this.form.containsLiquid,
        insurance: this.form.insurance,
        packaging: this.form.packaging,
      },
      rates: {
        base: this.rateBreakdown?.baseCost || 0,
        insurance: this.rateBreakdown?.insuranceCost || 0,
        signature: this.rateBreakdown?.signatureCost || 0,
        packaging: this.rateBreakdown?.packagingCost || 0,
        total: this.calculatedPrice || 0,
      },
    }
  }

  async submit(isDraft: boolean) {
    if (!isDraft && !this.#validateAll()) return

    this.loading = true
    this.submitError = null

    try {
      const editing = this.isEditMode && this.shipmentId
      const url = editing
        ? `/api/shipments/${this.shipmentId}`
        : isDraft
          ? '/api/shipments/draft'
          : '/api/shipments/finalize'

      const response = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.#payload()),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))

        if (error.validationErrors && typeof error.validationErrors === 'object') {
          this.errors = error.validationErrors
          this.submitError = error.message || 'Please correct the errors in the form'
          return
        }

        this.submitError =
          error.details || error.error || `Failed to ${editing ? 'update' : 'create'} shipment`
        return
      }

      await goto('/shipments?success=true')
    } catch (err) {
      console.error('Error submitting shipment:', err)
      this.submitError = err instanceof Error ? err.message : 'Something went wrong'
    } finally {
      this.loading = false
    }
  }
}
