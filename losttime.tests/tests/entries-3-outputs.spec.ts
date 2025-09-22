import { test, expect } from '@playwright/test';
import { chromium } from '@playwright/test';
import path from 'path';
import { readFileSync, unlinkSync } from 'fs';
import Papa from 'papaparse';
import { saveAsSuggested, addEntriesTestFile, getEntriesFilePath } from '../utilities/files';

test.describe('output formats', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/entries');
        await addEntriesTestFile('COC_1.csv', page)
    });

    test('OE11 Entry Format', async ({ page }) => {
        await page.getByRole('button', { name: 'Download OE File' }).click();
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'OE11 - Regular' }).click();
        const newFilePath = await saveAsSuggested(downloadPromise);

        // make sure the file contents are what we want
        const referenceFile = await readFileSync(getEntriesFilePath('OE11_COC_1.csv'));
        const newFile = await readFileSync(newFilePath);
        expect(newFile.equals(referenceFile)).toBe(true);

        // clean up - delete the file
        unlinkSync(newFilePath);
    });

    test('OE12 Entry Format', async ({ page }) => {
        await page.getByRole('button', { name: 'Download OE File' }).click();
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'OE12 - Regular' }).click();
        const newFilePath = await saveAsSuggested(downloadPromise);

        // make sure the file contents are what we want
        const referenceFile = await readFileSync(getEntriesFilePath('OE12_COC_1.csv'));
        const newFile = await readFileSync(newFilePath);
        expect(newFile.equals(referenceFile)).toBe(true);

        // clean up - delete the file
        unlinkSync(newFilePath);
    });
});

test.describe('output contents OE12', () => {
    test.beforeAll(async ({}, testInfo) => {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto('/entries');
        await addEntriesTestFile('COC_1.csv', page);
        await addEntriesTestFile('WIOL_6.csv', page);

        // Download in OE12 format
        await page.getByRole('button', { name: 'Download OE File' }).click();
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'OE12 - Regular' }).click();
        const download = await downloadPromise;
        await testInfo.attach('OE12', {path: await download.path()});

        await context.close();
        await browser.close();
    });

    test('rental', async ({page}, testInfo) => {
        const filePath = testInfo.attachments.find((x) => x.name==='OE12')?.path!;
        const file = readFileSync(filePath).toString();
        const res = Papa.parse<any>(file, {
            header: true
        });
        // Owned chip - not rental
        const Alice = res.data[0];
        expect(Alice['Chipno']).toBe('2345678')
        expect(Alice['Rented']).toBe('')
        // Rental chip
        const Che2 = res.data[3];
        expect(Che2['Chipno']).toBe('')
        expect(Che2['Rented']).toBe('X')
        // Rental chip - known number
        const Flo = res.data[6];
        expect(Flo['Chipno']).toBe('2051144')
        expect(Flo['Rented']).toBe('X')
    });

    test('nc', async ({page}, testInfo) => {
        const filePath = testInfo.attachments.find((x) => x.name==='OE12')?.path!;
        const file = readFileSync(filePath).toString();
        const res = Papa.parse<any>(file, {
            header: true
        });
        // Normal (Is competitive)
        const Alice = res.data[0];
        expect(Alice['nc']).toBe('')
        // Second Course
        const Che2 = res.data[3];
        expect(Che2['nc']).toBe('X')
        // NC Elementary
        const Flo = res.data[6];
        expect(Flo['nc']).toBe('X')
    });
        
});



