import { test, expect } from '@playwright/test'

test.describe('Study flow', () => {
  test.beforeEach(async ({ context }) => {
    // Clear storage state before each test
    await context.clearCookies()
    await context.addInitScript(() => {
      localStorage.clear()
    })
  })

  test('can access study page from homepage', async ({ page }) => {
    await page.goto('/')

    await page.locator('main').getByRole('link', { name: /étudier/i }).click()

    await expect(page).toHaveURL('/etudier')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('displays all categories on study page', async ({ page }) => {
    await page.goto('/etudier')

    // Check that category links are present (using partial text matches)
    await expect(page.getByRole('heading', { name: /principes/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /institutionnel/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /droits/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /histoire/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /société/i })).toBeVisible()
  })

  test('can start study mode from main study page', async ({ page }) => {
    await page.goto('/etudier')

    // Click the start button for all questions
    await page.getByRole('button', { name: /commencer/i }).click()

    // Should show study interface with question
    await expect(page.locator('h2').first()).toBeVisible()

    // Should show study controls
    await expect(page.getByRole('button', { name: /précédent/i })).toBeVisible()
  })

  test('can navigate to a specific category', async ({ page }) => {
    await page.goto('/etudier')

    // Click on a category link (look for the link containing "principes")
    await page.locator('a[href*="principes-valeurs"]').click()

    await expect(page).toHaveURL('/etudier/principes-valeurs')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/principes/i)
  })

  test('can start study mode from category page', async ({ page }) => {
    await page.goto('/etudier/principes-valeurs')

    // Click the start button
    await page.getByRole('button', { name: /commencer/i }).click()

    // Should show study interface with question
    await expect(page.locator('h2').first()).toBeVisible()
  })

  test('can answer a question in study mode', async ({ page }) => {
    await page.goto('/etudier/principes-valeurs')

    // Start studying
    await page.getByRole('button', { name: /commencer/i }).click()

    // Wait for question to load
    await expect(page.locator('h2').first()).toBeVisible()

    // Click on the first answer option button (buttons in .space-y-3 container)
    const optionContainer = page.getByTestId('answer-options')
    await optionContainer.locator('button').first().click()

    // Click validate button
    await page.getByRole('button', { name: /valider/i }).click()

    // Should show feedback (correct or incorrect message)
    await expect(page.getByTestId('answer-feedback')).toBeVisible()
  })

  test('can navigate between questions in study mode', async ({ page }) => {
    await page.goto('/etudier/principes-valeurs')

    // Start studying
    await page.getByRole('button', { name: /commencer/i }).click()

    // Wait for question to load - get initial question text
    const questionHeading = page.locator('h2').first()
    await expect(questionHeading).toBeVisible()
    const firstQuestionText = await questionHeading.textContent()

    // Answer the first question
    const optionContainer = page.getByTestId('answer-options')
    await optionContainer.locator('button').first().click()
    await page.getByRole('button', { name: /valider/i }).click()

    // Click next button
    await page.getByRole('button', { name: /suivant/i }).click()

    // Should show a different question
    await expect(questionHeading).toBeVisible()
    const secondQuestionText = await questionHeading.textContent()
    expect(secondQuestionText).not.toBe(firstQuestionText)

    // Go back to previous question
    await page.getByRole('button', { name: /précédent/i }).click()

    // Should show the first question again
    await expect(questionHeading).toBeVisible()
    const backToFirstText = await questionHeading.textContent()
    expect(backToFirstText).toBe(firstQuestionText)
  })

  test('can exit study mode', async ({ page }) => {
    await page.goto('/etudier/principes-valeurs')

    // Start studying
    await page.getByRole('button', { name: /commencer/i }).click()

    // Wait for study mode
    await expect(page.locator('h2').first()).toBeVisible()

    // Click exit button using data-testid for robustness
    await page.getByTestId('exit-study-button').click()

    // Should return to category page
    await expect(page.getByRole('button', { name: /commencer/i })).toBeVisible()
  })

  test('shows correct/incorrect feedback with explanations', async ({ page }) => {
    await page.goto('/etudier/principes-valeurs')

    // Start studying
    await page.getByRole('button', { name: /commencer/i }).click()

    // Wait for question to load
    await expect(page.locator('h2').first()).toBeVisible()

    // Answer the question
    const optionContainer = page.getByTestId('answer-options')
    await optionContainer.locator('button').first().click()
    await page.getByRole('button', { name: /valider/i }).click()

    // Should show explanation section (info box)
    await expect(page.getByTestId('explanation-box')).toBeVisible()
  })

  test('tracks progress through study session', async ({ page }) => {
    await page.goto('/etudier/principes-valeurs')

    // Start studying
    await page.getByRole('button', { name: /commencer/i }).click()

    // Wait for question to load
    await expect(page.locator('h2').first()).toBeVisible()

    // Should show progress indicator (e.g., "1/38" or similar)
    await expect(page.getByText(/\d+\s*\/\s*\d+/)).toBeVisible()
  })
})
