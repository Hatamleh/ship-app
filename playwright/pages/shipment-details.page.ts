import type { Locator, Page } from '@playwright/test'

export class ShipmentDetailsPage {
  readonly headingLocator: Locator = this.page.getByTestId('shipment-details-heading')
  readonly statusLocator: Locator = this.page.getByTestId('shipment-details-status')
  readonly finalizeButtonLocator: Locator = this.page.getByTestId('shipment-details-finalize')

  constructor(private readonly page: Page) {}

  async goto(id: number): Promise<void> {
    await this.page.goto(`/shipments/${id}`)
  }

  async finalize(): Promise<void> {
    await this.finalizeButtonLocator.click()
  }
}
