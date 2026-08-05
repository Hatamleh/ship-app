import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const SALT_ROUNDS = 10

// Generate random tracking number
function generateTrackingNumber(): string {
  const randomDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')
  return `TR${randomDigits}`
}

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.shipment.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('Test@1234', SALT_ROUNDS)

  // Create users for each country
  const usersData = [
    {
      email: 'jor@qacart.com',
      password: hashedPassword,
      fullName: 'Ahmad Khalil',
      phone: '0791234567',
      country: 'Jordan',
      city: 'Amman',
      street: 'King Abdullah II Street',
      postalCode: '11110',
    },
    {
      email: 'ksa@qacart.com',
      password: hashedPassword,
      fullName: 'Khalid Al-Otaibi',
      phone: '0551234567',
      country: 'Saudi Arabia',
      city: 'Riyadh',
      street: 'King Fahd Road',
      postalCode: '12211',
    },
    {
      email: 'uae@qacart.com',
      password: hashedPassword,
      fullName: 'Mohammed Al-Mansouri',
      phone: '0501234567',
      country: 'United Arab Emirates',
      city: 'Dubai',
      street: 'Sheikh Zayed Road',
      postalCode: '00000',
    },
    {
      email: 'kwt@qacart.com',
      password: hashedPassword,
      fullName: 'Fahad Al-Ajmi',
      phone: '96512345678',
      country: 'Kuwait',
      city: 'Kuwait City',
      street: 'Arabian Gulf Street',
      postalCode: '15000',
    },
    {
      email: 'egy@qacart.com',
      password: hashedPassword,
      fullName: 'Omar Hassan',
      phone: '01012345678',
      country: 'Egypt',
      city: 'Cairo',
      street: 'Tahrir Street',
      postalCode: '11511',
    },
  ]

  const users: Record<string, { id: number; email: string; fullName: string }> = {}

  for (const userData of usersData) {
    const user = await prisma.user.create({ data: userData })
    // Use country code as key (jor, ksa, uae, kwt, egy)
    const countryCode = userData.email.split('@')[0]
    users[countryCode] = { id: user.id, email: user.email, fullName: user.fullName }
    console.log(`Created user: ${user.email} (${user.fullName})`)
  }

  // Create sample shipments with various types and statuses
  const shipments = [
    // Domestic shipment (KSA)
    {
      trackingNumber: generateTrackingNumber(),
      userId: users['ksa'].id,
      senderName: 'Khalid Al-Otaibi',
      senderPhone: '0551234567',
      senderCountry: 'Saudi Arabia',
      senderCity: 'Riyadh',
      senderStreet: 'King Fahd Road',
      senderPostalCode: '12211',
      receiverName: 'Sultan Al-Harbi',
      receiverPhone: '0559876543',
      receiverCountry: 'Saudi Arabia',
      receiverCity: 'Jeddah',
      receiverStreet: 'Prince Sultan Street',
      receiverPostalCode: '21442',
      weight: 5.0,
      length: 30,
      width: 20,
      height: 15,
      contentDescription: '',
      shipmentType: 'Domestic',
      serviceType: 'domestic_standard',
      pickupMethod: 'home',
      signatureRequired: false,
      containsLiquid: false,
      insurance: false,
      packaging: false,
      price: 20.50,
      baseCost: 17.50,
      insuranceCost: 0,
      signatureCost: 0,
      packagingCost: 0,
      totalCost: 20.50,
      isDraft: false,
      status: 'finalized',
    },
    // IntraGulf shipment (Kuwait to UAE)
    {
      trackingNumber: generateTrackingNumber(),
      userId: users['kwt'].id,
      senderName: 'Fahad Al-Ajmi',
      senderPhone: '96512345678',
      senderCountry: 'Kuwait',
      senderCity: 'Kuwait City',
      senderStreet: 'Arabian Gulf Street',
      senderPostalCode: '15000',
      receiverName: 'Saeed Al-Nuaimi',
      receiverPhone: '0509876543',
      receiverCountry: 'United Arab Emirates',
      receiverCity: 'Dubai',
      receiverStreet: 'Sheikh Mohammed bin Rashid Boulevard',
      receiverPostalCode: '00000',
      weight: 10.0,
      length: 40,
      width: 30,
      height: 25,
      contentDescription: '',
      shipmentType: 'IntraGulf',
      serviceType: 'gulf_standard',
      pickupMethod: 'postal_office',
      signatureRequired: true,
      containsLiquid: false,
      insurance: true,
      packaging: false,
      price: 65.00,
      baseCost: 40.00,
      insuranceCost: 15.00,
      signatureCost: 5.00,
      packagingCost: 0,
      totalCost: 65.00,
      isDraft: false,
      status: 'finalized',
    },
    // International shipment (Jordan to Egypt)
    {
      trackingNumber: generateTrackingNumber(),
      userId: users['jor'].id,
      senderName: 'Ahmad Khalil',
      senderPhone: '0791234567',
      senderCountry: 'Jordan',
      senderCity: 'Amman',
      senderStreet: 'King Abdullah II Street',
      senderPostalCode: '11110',
      receiverName: 'Mahmoud Fahmy',
      receiverPhone: '01012345678',
      receiverCountry: 'Egypt',
      receiverCity: 'Cairo',
      receiverStreet: 'Al-Haram Street',
      receiverPostalCode: '11511',
      weight: 15.0,
      length: 50,
      width: 40,
      height: 30,
      contentDescription: 'Electronics and documents',
      shipmentType: 'International',
      serviceType: 'international_standard',
      pickupMethod: 'home',
      signatureRequired: true,
      containsLiquid: false,
      insurance: true,
      packaging: true,
      price: 123.00,
      baseCost: 95.00,
      insuranceCost: 15.00,
      signatureCost: 5.00,
      packagingCost: 8.00,
      totalCost: 123.00,
      isDraft: false,
      status: 'finalized',
    },
    // Draft shipment (Jordan domestic)
    {
      trackingNumber: generateTrackingNumber(),
      userId: users['jor'].id,
      senderName: 'Ahmad Khalil',
      senderPhone: '0791234567',
      senderCountry: 'Jordan',
      senderCity: 'Amman',
      senderStreet: 'King Abdullah II Street',
      senderPostalCode: '11110',
      receiverName: 'Sara Al-Zoubi',
      receiverPhone: '0799876543',
      receiverCountry: 'Jordan',
      receiverCity: 'Irbid',
      receiverStreet: 'Al-Hosn Street',
      receiverPostalCode: '21110',
      weight: 3.0,
      length: 20,
      width: 15,
      height: 10,
      contentDescription: '',
      shipmentType: 'Domestic',
      serviceType: 'domestic_express',
      pickupMethod: 'home',
      signatureRequired: true,
      containsLiquid: false,
      insurance: false,
      packaging: false,
      price: 45.00,
      baseCost: 33.00,
      insuranceCost: 0,
      signatureCost: 5.00,
      packagingCost: 0,
      totalCost: 45.00,
      isDraft: true,
      status: 'draft',
    },
    // International shipment (Egypt to KSA)
    {
      trackingNumber: generateTrackingNumber(),
      userId: users['egy'].id,
      senderName: 'Omar Hassan',
      senderPhone: '01012345678',
      senderCountry: 'Egypt',
      senderCity: 'Alexandria',
      senderStreet: 'Abu Qir Street',
      senderPostalCode: '21500',
      receiverName: 'Nasser Al-Qahtani',
      receiverPhone: '0561234567',
      receiverCountry: 'Saudi Arabia',
      receiverCity: 'Dammam',
      receiverStreet: 'King Saud Street',
      receiverPostalCode: '32241',
      weight: 20.0,
      length: 60,
      width: 40,
      height: 35,
      contentDescription: 'Clothing and personal items',
      shipmentType: 'International',
      serviceType: 'international_economy',
      pickupMethod: 'postal_office',
      signatureRequired: false,
      containsLiquid: false,
      insurance: false,
      packaging: true,
      price: 88.00,
      baseCost: 75.00,
      insuranceCost: 0,
      signatureCost: 0,
      packagingCost: 8.00,
      totalCost: 88.00,
      isDraft: false,
      status: 'finalized',
    },
    // UAE shipment
    {
      trackingNumber: generateTrackingNumber(),
      userId: users['uae'].id,
      senderName: 'Mohammed Al-Mansouri',
      senderPhone: '0501234567',
      senderCountry: 'United Arab Emirates',
      senderCity: 'Dubai',
      senderStreet: 'Sheikh Zayed Road',
      senderPostalCode: '00000',
      receiverName: 'Ali Al-Mutairi',
      receiverPhone: '96598765432',
      receiverCountry: 'Kuwait',
      receiverCity: 'Hawalli',
      receiverStreet: 'Tunis Street',
      receiverPostalCode: '32001',
      weight: 8.0,
      length: 35,
      width: 25,
      height: 20,
      contentDescription: 'Gifts',
      shipmentType: 'IntraGulf',
      serviceType: 'gulf_express',
      pickupMethod: 'home',
      signatureRequired: true,
      containsLiquid: false,
      insurance: true,
      packaging: true,
      price: 95.00,
      baseCost: 60.00,
      insuranceCost: 15.00,
      signatureCost: 5.00,
      packagingCost: 8.00,
      totalCost: 95.00,
      isDraft: false,
      status: 'finalized',
    },
  ]

  for (const shipment of shipments) {
    await prisma.shipment.create({ data: shipment })
  }

  console.log(`Created ${shipments.length} sample shipments`)

  console.log('')
  console.log('=====================================')
  console.log('Test Users (Password: Test@1234)')
  console.log('=====================================')
  for (const userData of usersData) {
    console.log(`  ${userData.email} - ${userData.fullName} (${userData.country})`)
  }
  console.log('=====================================')
  console.log('')
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
