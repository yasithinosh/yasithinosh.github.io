// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Theme Switching', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
    });

    test('Default theme should be respected', async ({ page }) => {
        // This depends on the system preference in the test environment, 
        // but we can check if the button is present and initial state is valid.
        const themeToggle = page.locator('#theme-toggle');
        await expect(themeToggle).toBeVisible();
    });

    test('Toggle theme changes attributes and icon', async ({ page }) => {
        const themeToggle = page.locator('#theme-toggle');
        const html = page.locator('html');
        const icon = themeToggle.locator('i');

        // Initial state might be light or dark depending on system/default
        const initialTheme = await html.getAttribute('data-theme');

        // Click toggle
        await themeToggle.click();

        // Check if theme changed
        const newTheme = await html.getAttribute('data-theme');
        expect(newTheme).not.toBe(initialTheme);
        expect(newTheme).toMatch(/light|dark/);

        // Check if icon class changed
        if (newTheme === 'light') {
            await expect(icon).toHaveClass(/fa-sun/);
        } else {
            await expect(icon).toHaveClass(/fa-moon/); // Assuming dark mode has moon
        }
    });

    test('Theme preference is saved to localStorage', async ({ page }) => {
        const themeToggle = page.locator('#theme-toggle');

        // Force click to ensure we set a preference
        await themeToggle.click();

        const currentTheme = await page.locator('html').getAttribute('data-theme');

        // Check local storage
        const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
        expect(storedTheme).toBe(currentTheme);
    });

    test('Theme persists on reload', async ({ page }) => {
        const themeToggle = page.locator('#theme-toggle');

        // Set specific theme (e.g., light)
        // We might need to click multiple times if it's already light, or just set it via JS
        await page.evaluate(() => {
            localStorage.setItem('theme', 'light');
        });

        await page.reload();

        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

        // Now set to dark
        await page.evaluate(() => {
            localStorage.setItem('theme', 'dark');
        });

        await page.reload();

        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    });
});
