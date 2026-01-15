import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('displays the hero section', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('h1')).toBeVisible()
    // Use first() to handle multiple quiz links
    await expect(page.getByRole('link', { name: /commencer/i }).first()).toBeVisible()
  })

  test('displays exam info section', async ({ page }) => {
    await page.goto('/')

    // Check for exam stats using data-testid selectors (more robust)
    await expect(page.getByTestId('exam-info-section')).toBeVisible()
    await expect(page.getByTestId('exam-stat-questions')).toBeVisible()
    await expect(page.getByTestId('exam-stat-minutes')).toBeVisible()
    await expect(page.getByTestId('exam-stat-passing')).toBeVisible()
    await expect(page.getByTestId('exam-stat-options')).toBeVisible()
  })

  test('can navigate to quiz page', async ({ page }) => {
    await page.goto('/')

    // Click the main CTA button (not the nav link)
    await page.locator('main').getByRole('link', { name: /commencer/i }).click()

    await expect(page).toHaveURL('/quiz')
  })

  test('can navigate to study page', async ({ page }) => {
    await page.goto('/')

    // Click the main CTA study link (not the nav link)
    await page.locator('main').getByRole('link', { name: /étudier/i }).click()

    await expect(page).toHaveURL('/etudier')
  })
})
