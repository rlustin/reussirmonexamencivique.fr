import { test, expect } from '@playwright/test'

test.describe('Quiz flow', () => {
  test.beforeEach(async ({ context }) => {
    // Clear storage state before each test (more efficient than navigating)
    await context.clearCookies()
    // Clear localStorage by adding a script that runs on page load
    await context.addInitScript(() => {
      localStorage.clear()
    })
  })

  test('shows start screen before quiz begins', async ({ page }) => {
    await page.goto('/quiz')

    // Should show the start screen with button
    await expect(page.getByRole('button', { name: /commencer/i })).toBeVisible()
  })

  test('can start a quiz and see the first question', async ({ page }) => {
    await page.goto('/quiz')

    // Click start button
    await page.getByRole('button', { name: /commencer/i }).click()

    // Should show question content (Question 1 of 40)
    await expect(page.getByText(/question 1/i)).toBeVisible()

    // Should show timer
    await expect(page.getByText(/\d{1,2}:\d{2}/)).toBeVisible()

    // Should show answer options (radiogroup with radio buttons)
    const radioGroup = page.getByRole('radiogroup')
    await expect(radioGroup).toBeVisible()
    await expect(radioGroup.getByRole('radio').first()).toBeVisible()
  })

  test('can select an answer and navigate to next question', async ({ page }) => {
    await page.goto('/quiz')

    // Start quiz
    await page.getByRole('button', { name: /commencer/i }).click()
    await expect(page.getByText(/question 1/i)).toBeVisible()

    // Click the first answer option (radio button)
    await page.getByRole('radiogroup').getByRole('radio').first().click()

    // Click next button
    await page.getByRole('button', { name: /suivant/i }).click()

    // Should be on question 2
    await expect(page.getByText(/question 2/i)).toBeVisible()
  })

  test('can navigate between questions', async ({ page }) => {
    await page.goto('/quiz')

    // Start quiz
    await page.getByRole('button', { name: /commencer/i }).click()
    await expect(page.getByText(/question 1/i)).toBeVisible()

    // Go to next question
    await page.getByRole('button', { name: /suivant/i }).click()
    await expect(page.getByText(/question 2/i)).toBeVisible()

    // Go back to previous question
    await page.getByRole('button', { name: /précédent/i }).click()
    await expect(page.getByText(/question 1/i)).toBeVisible()
  })

  test('can jump to a question using progress dots', async ({ page }) => {
    await page.goto('/quiz')

    // Start quiz
    await page.getByRole('button', { name: /commencer/i }).click()
    await expect(page.getByText(/question 1/i)).toBeVisible()

    // Navigate to question 5 using data-testid (more robust selector)
    await page.getByTestId('progress-dot-5').click()

    // Should be on question 5
    await expect(page.getByText(/question 5/i)).toBeVisible()
  })

  test('shows confirmation modal when submitting with unanswered questions', async ({ page }) => {
    await page.goto('/quiz')

    // Start quiz
    await page.getByRole('button', { name: /commencer/i }).click()

    // Navigate to the last question (question 40) using data-testid
    await page.getByTestId('progress-dot-40').click()

    // Should be on question 40
    await expect(page.getByText(/question 40/i)).toBeVisible()

    // Now the "Terminer" button should be visible
    await page.getByRole('button', { name: /terminer/i }).click()

    // Should show confirmation modal (since we haven't answered any questions)
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  // Note: Questions are imported statically at build time, so route mocking
  // doesn't work. This test answers all 40 questions which takes longer.
  test('can complete quiz and see results', async ({ page }) => {
    // Mark as slow test (3x default timeout) since it needs to answer 40 questions
    test.slow()

    await page.goto('/quiz')

    // Start quiz
    await page.getByRole('button', { name: /commencer/i }).click()

    // Answer all 40 questions
    for (let i = 1; i <= 40; i++) {
      // Select first answer option
      await page.getByRole('radiogroup').getByRole('radio').first().click()

      if (i < 40) {
        // Go to next question
        await page.getByRole('button', { name: /suivant/i }).click()
      } else {
        // Submit the quiz on the last question
        await page.getByRole('button', { name: /terminer/i }).click()
      }
    }

    // Should redirect to results page
    await expect(page).toHaveURL('/results')

    // Should show score (X/40)
    await expect(page.getByText(/\/40/)).toBeVisible()
  })
})
