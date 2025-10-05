import { test, expect } from '@playwright/test';

test('title', async ({ page }) => {
    await page.goto('/');

    // Expect title containing string
    await expect(page).toHaveTitle(/Lost Time/);

    // Expect headers on page:
    await expect(page.getByRole('heading', {name: 'Lost Time'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Entries'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Results'})).toBeVisible();
});

test('header nav: entries', async ({ page }) => {
    await page.goto('/');

    // Click on Manage Entries Header link
    await page.getByRole('link', { name: 'Entries' }).click();

    // Expect url to change
    await expect(page.url()).toContain('/entries')

    // Expect Entries Header on the page
    await expect(page.getByRole('heading', {name: 'Manage Entries'})).toBeVisible();
})

test('header nav: Results', async ({ page }) => {
    await page.goto('/');

    // Click on Manage Entries Header link
    await page.getByRole('link', { name: 'Results' }).click();

    // Expect url to change
    await expect(page.url()).toContain('/results')

    // Expect Results Header on the page
    await expect(page.getByRole('heading', {name: 'Better Results'})).toBeVisible();
})

test('header nav: Docs', async ({ page }) => {
    await page.goto('/');

    // Click on Manage Entries Header link
    await page.getByRole('link', { name: 'Docs' }).click();

    // Expect url to change
    await expect(page.url()).toContain('/docs')

    // Expect Results Header on the page
    await expect(page.getByRole('heading', {name: 'Documentation'})).toBeVisible();
})