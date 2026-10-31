import type { Locator, Page } from '@playwright/test'

export interface ReceiverData {
  country: string
  name: string
  phone: string
  city: string
  postalCode: string
}

export interface PackageData {
  weight: string
  length: string
  width: string
  height: string
}

export class OrderFormPage {
  readonly headingLocator: Locator = this.page.getByTestId('order-form-heading')
  readonly receiverCountryLocator: Locator = this.page.getByTestId('receiver-country')
  readonly receiverNameLocator: Locator = this.page.getByTestId('receiver-name')
  readonly receiverPhoneLocator: Locator = this.page.getByTestId('receiver-phone')
  readonly receiverCityLocator: Locator = this.page.getByTestId('receiver-city')
  readonly receiverPostalCodeLocator: Locator = this.page.getByTestId('receiver-postal-code')
  readonly packageWeightLocator: Locator = this.page.getByTestId('package-weight')
  readonly packageLengthLocator: Locator = this.page.getByTestId('package-length')
  readonly packageWidthLocator: Locator = this.page.getByTestId('package-width')
  readonly packageHeightLocator: Locator = this.page.getByTestId('package-height')
  readonly totalPriceLocator: Locator = this.page.getByTestId('rate-total-price')
  readonly saveDraftButtonLocator: Locator = this.page.getByTestId('order-form-save-draft')

  constructor(private readonly page: Page) {}

  serviceRadioLocator(serviceId: string): Locator {
    return this.page.getByTestId(`service-${serviceId}`)
  }

  async goto(): Promise<void> {
    await this.page.goto('/')
  }

  async fillReceiver(data: ReceiverData): Promise<void> {
    await this.receiverCountryLocator.selectOption({ label: data.country })
    await this.receiverNameLocator.fill(data.name)
    await this.receiverPhoneLocator.fill(data.phone)
    await this.receiverCityLocator.fill(data.city)
    await this.receiverPostalCodeLocator.fill(data.postalCode)
  }

  async fillPackage(data: PackageData): Promise<void> {
    await this.packageWeightLocator.fill(data.weight)
    await this.packageLengthLocator.fill(data.length)
    await this.packageWidthLocator.fill(data.width)
    await this.packageHeightLocator.fill(data.height)
  }

  async selectService(serviceId: string): Promise<void> {
    await this.serviceRadioLocator(serviceId).check()
  }

  async saveDraft(): Promise<void> {
    await this.saveDraftButtonLocator.click()
  }
}
