import type { Locator, Page } from '@playwright/test'

export interface LoginFormData {
  email: string
  password: string
}

export class LoginPage {
  readonly emailLocator: Locator = this.page.getByTestId('login-email')
  readonly passwordLocator: Locator = this.page.getByTestId('login-password')
  readonly submitButtonLocator: Locator = this.page.getByTestId('login-submit')

  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/login')
  }

  async fillForm(data: LoginFormData): Promise<void> {
    await this.emailLocator.fill(data.email)
    await this.passwordLocator.fill(data.password)
  }

  async submit(): Promise<void> {
    await this.submitButtonLocator.click()
  }
}
