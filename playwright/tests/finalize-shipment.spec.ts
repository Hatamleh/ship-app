import { test, expect } from '@playwright/test'
import { AuthClient, type LoginCredentials } from '../clients/auth.client'
import { ShipmentsClient, type DraftShipmentPayload } from '../clients/shipments.client'
import {
  OrderFormPage,
  type PackageData,
  type ReceiverData,
} from '../pages/shipment-form.page'
import { ShipmentDetailsPage } from '../pages/shipment-details.page'
import { ShipmentsPage } from '../pages/shipments.page'

test.describe('Finalize shipment', () => {
  test('Jordan customer creates a draft shipment and finalizes it from the shipment details page', async ({ page }) => {
    const orderFormPage = new OrderFormPage(page)
    const shipmentsPage = new ShipmentsPage(page)
    const shipmentDetailsPage = new ShipmentDetailsPage(page)

    const credentials: LoginCredentials = { email: 'jor@qacart.com', password: 'Test@1234' }
    const receiver: ReceiverData = {
      country: 'Jordan',
      name: `Sara Al-Zoubi ${Date.now()}`,
      phone: '0791234567',
      city: 'Irbid',
      postalCode: '21110',
    }
    const pkg: PackageData = { weight: '5', length: '30', width: '20', height: '15' }
    const serviceId: string = 'domestic_standard'

    await test.step('Log in through the API (login is covered by login.spec.ts)', async () => {
      await expect(await AuthClient.login(page.request, credentials)).toBeOK()
    }, { box: true })

    await test.step('Create a draft shipment', async () => {
      await shipmentsPage.dismissPromoWhenItAppears()
      await orderFormPage.goto()
      await orderFormPage.fillReceiver(receiver)
      await orderFormPage.fillPackage(pkg)
      await orderFormPage.selectService(serviceId)
      await expect(orderFormPage.totalPriceLocator).not.toHaveText('-')
      await orderFormPage.saveDraft()
      await expect(page).toHaveURL('/shipments?success=true')
      await expect(shipmentsPage.rowStatusLocator(receiver.name)).toHaveText('Draft')
    }, { box: true })

    await test.step('Open the draft details page from the row menu', async () => {
      await shipmentsPage.openRowMenu(receiver.name)
      await shipmentsPage.clickView(receiver.name)
      await expect(shipmentDetailsPage.headingLocator).toHaveText(/^Draft Shipment #\d+$/)
      await expect(shipmentDetailsPage.statusLocator).toHaveText('Draft')
    }, { box: true })

    await test.step('Finalize the shipment', async () => {
      await shipmentDetailsPage.finalize()
    }, { box: true })

    await test.step('Check the shipment is finalized', async () => {
      await expect(shipmentDetailsPage.statusLocator).toHaveText('Finalized')
      await expect(shipmentDetailsPage.headingLocator).toHaveText(/^TR\d+$/)
      await expect(shipmentDetailsPage.finalizeButtonLocator).toHaveCount(0)
    }, { box: true })
  })

  test('Saudi customer finalizes an API-created draft shipment from the shipments table row menu', async ({ page }) => {
    const shipmentsPage = new ShipmentsPage(page)

    const credentials: LoginCredentials = { email: 'ksa@qacart.com', password: 'Test@1234' }
    const receiverName: string = `Sultan Al-Harbi ${Date.now()}`
    const draft: DraftShipmentPayload = {
      from: {
        name: 'Khalid Al-Otaibi',
        phone: '0551234567',
        country: 'Saudi Arabia',
        city: 'Riyadh',
        street: 'King Fahd Road',
        postalCode: '12211',
      },
      to: {
        name: receiverName,
        phone: '0559876543',
        country: 'Saudi Arabia',
        city: 'Jeddah',
        street: 'Prince Sultan Street',
        postalCode: '21442',
      },
      package: { weight: 5, length: 30, width: 20, height: 15, description: '' },
      service: { type: 'domestic_standard', pickupMethod: 'home', shipmentType: 'Domestic' },
      additional: { signature: false, liquid: false, insurance: false, packaging: false },
      rates: { base: 25.5, signature: 0, insurance: 0, packaging: 0, total: 25.5 },
    }

    await test.step('Log in through the API', async () => {
      await expect(await AuthClient.login(page.request, credentials)).toBeOK()
    }, { box: true })

    await test.step('Create a draft shipment through the API', async () => {
      await expect(await ShipmentsClient.saveDraft(page.request, draft)).toBeOK()
    }, { box: true })

    await test.step('Find the draft shipment in the shipments table', async () => {
      await shipmentsPage.dismissPromoWhenItAppears()
      await shipmentsPage.goto()
      await expect(shipmentsPage.rowLocator(receiverName)).toBeVisible()
      await expect(shipmentsPage.rowStatusLocator(receiverName)).toHaveText('Draft')
    }, { box: true })

    await test.step('Open the row menu and select Finalize Shipment', async () => {
      // A click made before the page hydrates is lost, so retry opening the menu until the option shows.
      await expect(async () => {
        await shipmentsPage.openRowMenu(receiverName)
        await expect(shipmentsPage.finalizeMenuItemLocator(receiverName)).toBeVisible({ timeout: 2000 })
      }).toPass()
      await shipmentsPage.clickFinalize(receiverName)
    }, { box: true })

    await test.step('Check the shipment is finalized in the table', async () => {
      await expect(shipmentsPage.rowStatusLocator(receiverName)).toHaveText('Finalized')
    }, { box: true })
  })
})
