import { test, expect } from '@playwright/test'
import { AuthClient, type LoginCredentials } from '../clients/auth.client'
import {
  OrderFormPage,
  type PackageData,
  type ReceiverData,
} from '../pages/shipment-form.page'
import { ShipmentsPage } from '../pages/shipments.page'

test.describe('Create draft shipment', () => {
  test('Jordan customer saves a domestic Jordan to Jordan shipment as a draft', async ({ page }) => {
    const orderFormPage = new OrderFormPage(page)
    const shipmentsPage = new ShipmentsPage(page)

    const credentials: LoginCredentials = { email: 'jor@qacart.com', password: 'Test@1234' }
    const receiver: ReceiverData = {
      country: 'Jordan',
      name: 'Sara Al-Zoubi',
      phone: '0791234567',
      city: 'Irbid',
      postalCode: '21110',
    }
    const pkg: PackageData = { weight: '5', length: '30', width: '20', height: '15' }
    const serviceId: string = 'domestic_standard'

    await test.step('Log in through the API (login is covered by login.spec.ts)', async () => {
      // page.request shares cookies with the page, so the session carries over to the UI.
      await expect(await AuthClient.login(page.request, credentials)).toBeOK()
    }, { box: true })

    await test.step('Open the shipment form page', async () => {
      await orderFormPage.goto()
      await expect(orderFormPage.headingLocator).toBeVisible()
    }, { box: true })

    await test.step('Fill the receiver and package details', async () => {
      await orderFormPage.fillReceiver(receiver)
      await orderFormPage.fillPackage(pkg)
    }, { box: true })

    await test.step('Select the Domestic Standard service', async () => {
      await orderFormPage.selectService(serviceId)
      await expect(orderFormPage.serviceRadioLocator(serviceId)).toBeChecked()
      await expect(orderFormPage.totalPriceLocator).not.toHaveText('-')
    }, { box: true })

    await test.step('Save the shipment as a draft', async () => {
      await orderFormPage.saveDraft()
    }, { box: true })

    await test.step('Check the draft shipment appears in My Shipments', async () => {
      await expect(page).toHaveURL('/shipments?success=true')
      await expect(shipmentsPage.successMessageLocator).toHaveText('Shipment saved successfully!')
      await expect(shipmentsPage.receiverNameLocator.filter({ hasText: receiver.name }).first()).toBeVisible()
    }, { box: true })
  })
})
