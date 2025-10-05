import { test, expect } from '@playwright/test';
import { addEntriesTestFile } from '../utilities/files';

test.beforeEach(async ({page}) => {
    await page.goto('/entries');
});

test('xlsx', async ({ page }) => {
    // WHEN: 
    //   a random xlsx file
    await addEntriesTestFile('invalid.xlsx', page);
    // THEN: 
    //   Uploaded file name is listed
    //   Uploaded file count is 1
    //   Records found in file is 0 
    await expect(page.getByText('invalid.xlsx')).toBeVisible()
    await expect(page.getByText('Files Uploaded:')).toContainText('1')
    await expect(page.getByText('Found: 0')).toBeVisible()
});

test('xml', async ({ page }) => {
    // WHEN: 
    //   a random xml file
    await addEntriesTestFile('invalid.xml', page);
    // THEN: 
    //   Uploaded file name is listed
    //   Uploaded file count is 1
    //   Records found in file is 0 
    await expect(page.getByText('invalid.xml')).toBeVisible()
    await expect(page.getByText('Files Uploaded:')).toContainText('1')
    await expect(page.getByText('Found: 0')).toBeVisible()
});

test('unrecognized txt', async ({ page }) => {
    // WHEN: 
    //   a random text file
    await addEntriesTestFile('invalid.txt', page);
    // THEN: 
    //   Uploaded file name is listed
    //   Uploaded file count is 1
    //   Records found in file is 0 
    await expect(page.getByText('invalid.txt')).toBeVisible()
    await expect(page.getByText('Files Uploaded:')).toContainText('1')
    await expect(page.getByText('Found: 0')).toBeVisible()
});

test('unrecognized csv', async ({ page }) => {
    // WHEN: 
    //   upload csv file that doesn't match an existing supported spec
    await addEntriesTestFile('invalid.csv', page);
    // THEN: 
    //   Uploaded file name is listed
    //   Uploaded file count is 1
    //   Records found in file is 0 
    //   Failed records in file is 1
    await expect(page.getByText('invalid.csv')).toBeVisible()
    await expect(page.getByText('Files Uploaded:')).toContainText('1')
    await expect(page.getByText('Found: 0')).toBeVisible()
    await expect(page.getByText('Failed: 1')).toBeVisible()
});

test('COC csv - empty', async ({ page }) => {
    // WHEN: 
    //   upload a COC format csv file with headers only
    await addEntriesTestFile('COC_HeaderOnly.csv', page);
    // THEN: 
    //   Uploaded file name is listed
    //   Uploaded file count is 1
    //   Records found in file is 0 
    await expect(page.getByText('COC_HeaderOnly.csv')).toBeVisible()
    await expect(page.getByText('Files Uploaded:')).toContainText('1')
    await expect(page.getByText('Found: 0')).toBeVisible()
});

test('COC csv - single record', async ({ page }) => {
    // WHEN:
    //   upload a COC format csv file with only one record
    await addEntriesTestFile('COC_1.csv', page);
    // THEN:
    //   Uploaded file name is listed
    //   Uploaded file count is 1
    //   Records found in file is 1
    //   Entries summary starts count is 1
    //   All participants count is 1
    await expect(page.getByText('COC_1.csv')).toBeVisible();
    await expect(page.getByText('Files Uploaded:')).toContainText('1');
    await expect(page.getByText('Found: 1')).toBeVisible();
    await expect(page.getByText('Summary:')).toContainText('1');
    await expect(page.getByText('All Entries:')).toContainText('1');
    //   Class in summary is correct
    await expect(page.getByTestId('starts-by-class-items')).toContainText('9F: 1')
    //   Participant list information is correct
    const table = page.getByRole('table');
    await expect(table.locator('tr:nth-child(1) td:nth-child(1)')).toHaveText('Alice'); // First
    await expect(table.locator('tr:nth-child(1) td:nth-child(2)')).toHaveText('Smith'); // Last
    await expect(table.locator('tr:nth-child(1) td:nth-child(3)')).toBeEmpty(); // Group
    await expect(table.locator('tr:nth-child(1) td:nth-child(4)')).toHaveText('2345678'); // Chip
    await expect(table.locator('tr:nth-child(1) td:nth-child(5)')).toHaveText('no'); // Rented
    await expect(table.locator('tr:nth-child(1) td:nth-child(6)')).toHaveText('9F'); // Class
});

test('WIOL csv - empty', async ({ page }) => {
    // WHEN:
    //   upload a WIOL format csv file with only headers
    await addEntriesTestFile('WIOL_HeaderOnly.csv', page);
    // THEN: 
    //   Uploaded file name is listed
    //   Uploaded file count is 1
    //   Records found in file is 0 
    await expect(page.getByText('WIOL_HeaderOnly.csv')).toBeVisible()
    await expect(page.getByText('Files Uploaded:')).toContainText('1')
    await expect(page.getByText('Found: 0')).toBeVisible()
});

test('WIOL csv - single record', async ({ page }) => {
    // WHEN:
    //   upload a WIOL format csv file with only one record
    await addEntriesTestFile('WIOL_1.csv', page);

    await expect(page.getByText('Files Uploaded:')).toContainText('1');
    await expect(page.getByText('WIOL_1.csv')).toBeVisible();
    await expect(page.getByText('Found: 1')).toBeVisible();
    await expect(page.getByText('All Entries:')).toContainText('1');
    await expect(page.getByText('Summary:')).toContainText('1');

    // Validate Summary
    await expect(page.getByTestId('starts-by-class-items')).toContainText('W6M: 1')

    // Validate participants list
    const table = page.getByRole('table');
    await expect(table.locator('tr:nth-child(1) td:nth-child(1)')).toHaveText('Bill'); // First
    await expect(table.locator('tr:nth-child(1) td:nth-child(2)')).toHaveText('Thomson'); // Last
    await expect(table.locator('tr:nth-child(1) td:nth-child(3)')).toBeEmpty(); // Group
    await expect(table.locator('tr:nth-child(1) td:nth-child(4)')).toHaveText('1334433'); // Chip
    await expect(table.locator('tr:nth-child(1) td:nth-child(5)')).toHaveText('no'); // Rented
    await expect(table.locator('tr:nth-child(1) td:nth-child(6)')).toHaveText('W6M'); // Class
    await expect(table.locator('tr:nth-child(1) td:nth-child(7)')).toHaveText('333'); // Bib

});

test.describe('WIOL csv variations', () => {
    test.beforeEach(async ({page}) => {
        await addEntriesTestFile('WIOL_6.csv', page);
    });

    test('summary', async ({ page }) => {
        
        // Validate Upload Info
        await expect(page.getByText('Files Uploaded:')).toContainText('1');
        await expect(page.getByText('WIOL_6.csv')).toBeVisible();
        await expect(page.getByText('Found: 6')).toBeVisible();
        await expect(page.getByText('All Entries:')).toContainText('6');
        await expect(page.getByText('Summary:')).toContainText('6');

        // Validate Class Entries Summary
        await expect(page.getByTestId('starts-by-class-items')).toContainText('W1F: 1')
        await expect(page.getByTestId('starts-by-class-items')).toContainText('W1M: 1')
        await expect(page.getByTestId('starts-by-class-items')).toContainText('W5F: 1')
        await expect(page.getByTestId('starts-by-class-items')).toContainText('W6M: 2')
        await expect(page.getByTestId('starts-by-class-items')).toContainText('W8M: 1')
    });

    test('standard', async ({page}) => {
        const table = page.getByRole('table');
        await expect(table.locator('tr:nth-child(2) td:nth-child(1)')).toHaveText('Che'); // First
        await expect(table.locator('tr:nth-child(2) td:nth-child(2)')).toHaveText('Awight'); // Last
        await expect(table.locator('tr:nth-child(2) td:nth-child(3)')).toBeEmpty(); // Group
        await expect(table.locator('tr:nth-child(2) td:nth-child(4)')).toHaveText('1222255'); // Chip
        await expect(table.locator('tr:nth-child(2) td:nth-child(5)')).toHaveText('no'); // Rented
        await expect(table.locator('tr:nth-child(2) td:nth-child(6)')).toHaveText('W6M'); // Class
        await expect(table.locator('tr:nth-child(2) td:nth-child(7)')).toHaveText('255'); // Bib
    });

    test('second course', async ({page}) => {
        const table = page.getByRole('table');
        await expect(table.locator('tr:nth-child(3) td:nth-child(1)')).toHaveText('Che'); // First
        await expect(table.locator('tr:nth-child(3) td:nth-child(2)')).toHaveText('Awight'); // Last
        await expect(table.locator('tr:nth-child(3) td:nth-child(3)')).toBeEmpty(); // Group
        await expect(table.locator('tr:nth-child(3) td:nth-child(4)')).toBeEmpty(); // Chip
        await expect(table.locator('tr:nth-child(3) td:nth-child(5)')).toHaveText('yes'); // Rented
        await expect(table.locator('tr:nth-child(3) td:nth-child(6)')).toHaveText('W8M'); // Class
        await expect(table.locator('tr:nth-child(3) td:nth-child(7)')).toBeEmpty(); // Bib
    });

    test('rental', async ({page}) => {
        const table = page.getByRole('table');
        await expect(table.locator('tr:nth-child(5) td:nth-child(1)')).toHaveText('Edlih'); // First
        await expect(table.locator('tr:nth-child(5) td:nth-child(2)')).toHaveText('Lossh'); // Last
        await expect(table.locator('tr:nth-child(5) td:nth-child(3)')).toBeEmpty(); // Group
        await expect(table.locator('tr:nth-child(5) td:nth-child(4)')).toBeEmpty(); // Chip
        await expect(table.locator('tr:nth-child(5) td:nth-child(5)')).toHaveText('yes'); // Rented
        await expect(table.locator('tr:nth-child(5) td:nth-child(6)')).toHaveText('W1F'); // Class
        await expect(table.locator('tr:nth-child(5) td:nth-child(7)')).toHaveText('102'); // Bib
    });

    test('known rental', async ({page}) => {
        const table = page.getByRole('table');
        await expect(table.locator('tr:nth-child(6) td:nth-child(1)')).toHaveText('Flo'); // First
        await expect(table.locator('tr:nth-child(6) td:nth-child(2)')).toHaveText('McMichaels'); // Last
        await expect(table.locator('tr:nth-child(6) td:nth-child(3)')).toBeEmpty(); // Group
        await expect(table.locator('tr:nth-child(6) td:nth-child(4)')).toHaveText('2051144'); // Chip
        await expect(table.locator('tr:nth-child(6) td:nth-child(5)')).toHaveText('yes'); // Rented
        await expect(table.locator('tr:nth-child(6) td:nth-child(6)')).toHaveText('W1M'); // Class
        await expect(table.locator('tr:nth-child(6) td:nth-child(7)')).toHaveText('135'); // Bib
    });
})