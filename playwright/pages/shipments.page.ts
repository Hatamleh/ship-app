import type { Locator, Page } from '@playwright/test'

export class ShipmentsPage {
  readonly successMessageLocator: Locator = this.page.getByTestId('shipments-success-message')
  readonly receiverNameLocator: Locator = this.page.getByTestId('shipments-receiver-name')
  readonly promoModalLocator: Locator = this.page.getByTestId('promo-modal')
  readonly promoCloseButtonLocator: Locator = this.page.getByTestId('promo-close')

  constructor(private readonly page: Page) {}

  /** The table row of the shipment sent to this receiver name. */
  rowLocator(receiverName: string): Locator {
    return this.page.getByTestId('shipments-row').filter({ hasText: receiverName })
  }

  rowStatusLocator(receiverName: string): Locator {
    return this.rowLocator(receiverName).getByTestId('shipments-row-status')
  }

  /** The promo popup appears randomly; close it whenever it blocks an action. */
  async dismissPromoWhenItAppears(): Promise<void> {
    await this.page.addLocatorHandler(this.promoModalLocator, async () => {
      await this.promoCloseButtonLocator.click()
    })
  }

  async goto(): Promise<void> {
    await this.page.goto('/shipments')
  }

  async openRowMenu(receiverName: string): Promise<void> {
    await this.rowLocator(receiverName).getByTestId('shipments-row-menu-button').click()
  }

  async clickView(receiverName: string): Promise<void> {
    await this.rowLocator(receiverName).getByTestId('shipments-menu-view').click()
  }

  finalizeMenuItemLocator(receiverName: string): Locator {
    return this.rowLocator(receiverName).getByTestId('shipments-menu-finalize')
  }

  async clickFinalize(receiverName: string): Promise<void> {
    await this.finalizeMenuItemLocator(receiverName).click()
  }
}
