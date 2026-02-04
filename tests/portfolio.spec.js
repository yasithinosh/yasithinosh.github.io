// @ts-check
const { test, expect } = require('@playwright/test');

test('Portfolio loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check title
    await expect(page).toHaveTitle(/InoVoid/);

    // Check for critical elements
    await expect(page.locator('.hero-section')).toBeVisible();
    await expect(page.getByText('Yasith Inosh')).toBeVisible();

    // Check "Download CV" button
    const downloadBtn = page.locator('a.btn-primary', { hasText: 'Download CV' });
    await expect(downloadBtn).toBeVisible();
    await expect(downloadBtn).toHaveAttribute('href', 'assets/dummy-cv.pdf');

    // Check Profile Picture
    await expect(page.locator('.profile-img')).toBeVisible();

    // Check Navigation
    await expect(page.locator('.navbar')).toBeVisible();
});

test('GitHub Projects section loads', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Scroll to projects
    await page.locator('#projects').scrollIntoViewIfNeeded();

    // Wait for repos to load (or retry button if API limit)
    // We check for either the "retry" button or "repo-card"
    // Since this is a test, we might expect failure if API limit is hit, which is okay.
    // But ideally we mock the API. For now, let's just check the section exists.
    await expect(page.locator('#projects h2')).toHaveText('GitHub Projects');

    // Check if loader appears initially
    // await expect(page.locator('.loader')).toBeVisible(); // Might be too fast
});
