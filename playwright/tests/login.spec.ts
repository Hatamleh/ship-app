import { test, expect } from '@playwright/test'
import { LoginPage, type LoginFormData } from '../pages/login.page'
import { OrderFormPage } from '../pages/shipment-form.page'
import { SidebarComponent } from '../components/sidebar.component'

test.describe('Login', () => {
  test('existing user logs in and lands on the order form', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const orderFormPage = new OrderFormPage(page)
    const sidebar = new SidebarComponent(page)

    const credentials: LoginFormData = {
      email: 'ksa@qacart.com',
      password: 'Test@1234',
    }
    const fullName: string = 'Khalid Al-Otaibi'

    await test.step('Log in with a valid account', async () => {
      await loginPage.goto()
      await loginPage.fillForm(credentials)
      await loginPage.submit()
    }, { box: true })

    await test.step('Check the user lands on the order form', async () => {
      await expect(page).toHaveURL('/')
      await expect(orderFormPage.headingLocator).toHaveText('Create a New Shipment')
    }, { box: true })

    await test.step('Check the sidebar shows the logged-in user', async () => {
      await expect(sidebar.userNameLocator).toHaveText(fullName)
      await expect(sidebar.userEmailLocator).toHaveText(credentials.email)
    }, { box: true })
  })
})
