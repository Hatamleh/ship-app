import type { Locator, Page } from '@playwright/test'

export class SidebarComponent {
  readonly userNameLocator: Locator = this.page.getByTestId('sidebar-user-name')
  readonly userEmailLocator: Locator = this.page.getByTestId('sidebar-user-email')

  constructor(private readonly page: Page) {}
}
