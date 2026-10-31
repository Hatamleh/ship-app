import type { Locator, Page } from '@playwright/test'

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phone: string
  country: string
  city: string
  postalCode: string
  street: string
}

export class RegisterPage {
  readonly emailLocator: Locator = this.page.getByTestId('register-email')
  readonly passwordLocator: Locator = this.page.getByTestId('register-password')
  readonly confirmPasswordLocator: Locator = this.page.getByTestId('register-confirm-password')
  readonly fullNameLocator: Locator = this.page.getByTestId('register-full-name')
  readonly phoneLocator: Locator = this.page.getByTestId('register-phone')
  readonly countryLocator: Locator = this.page.getByTestId('register-country')
  readonly cityLocator: Locator = this.page.getByTestId('register-city')
  readonly postalCodeLocator: Locator = this.page.getByTestId('register-postal-code')
  readonly streetLocator: Locator = this.page.getByTestId('register-street')
  readonly submitButtonLocator: Locator = this.page.getByTestId('register-submit')

  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/register')
  }

  async fillForm(data: RegisterFormData) {
    await this.emailLocator.fill(data.email)
    await this.passwordLocator.fill(data.password)
    await this.confirmPasswordLocator.fill(data.confirmPassword)
    await this.fullNameLocator.fill(data.fullName)
    await this.phoneLocator.fill(data.phone)
    await this.countryLocator.selectOption(data.country)
    await this.cityLocator.fill(data.city)
    await this.postalCodeLocator.fill(data.postalCode)
    await this.streetLocator.fill(data.street)
  }

  async submit() {
    await this.submitButtonLocator.click()
  }
}
