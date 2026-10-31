import { test, expect } from '@playwright/test'
import { RegisterPage, type RegisterFormData } from '../pages/register.page'
import { OrderFormPage } from '../pages/shipment-form.page'
import { SidebarComponent } from '../components/sidebar.component'

test.describe('Register', () => {
  test('visitor registers a new account and lands on the order form', async ({ page }) => {
    const registerPage = new RegisterPage(page)
    const orderFormPage = new OrderFormPage(page)
    const sidebar = new SidebarComponent(page)

    const password: string = 'Test@1234'
    const user: RegisterFormData = {
      email: `user-${Date.now()}@qacart.com`,
      password,
      confirmPassword: password,
      fullName: 'Sara Haddad',
      phone: '0791234567',
      country: 'Jordan',
      city: 'Amman',
      postalCode: '11118',
      street: '12 Rainbow Street',
    }

    await test.step('Fill the registration form and submit', async () => {
      await registerPage.goto()
      await registerPage.fillForm(user)
      await registerPage.submit()
    }, { box: true })

    await test.step('Check the new user lands on the order form', async () => {
      await expect(orderFormPage.headingLocator).toBeVisible()
      await expect(orderFormPage.headingLocator).toHaveText('Create a New Shipment')
    }, { box: true })

    await test.step('Check the sidebar shows the new account', async () => {
      await expect(sidebar.userNameLocator).toHaveText(user.fullName)
      await expect(sidebar.userEmailLocator).toHaveText(user.email)
    }, { box: true })
  })
})
