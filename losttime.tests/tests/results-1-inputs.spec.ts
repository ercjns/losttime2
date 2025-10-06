import { test, expect } from '@playwright/test';
import { addResultsTestFile } from '../utilities/files';


test.describe("Unsupported results file types", () => {

// text, other delimited
// generic CSV
// xml that's not an IOF resultsList
// xml v2
// xml v2 splits

    test.beforeEach(async ({page}) => {
        await page.goto('/results');
    });

    test('plaintext', async ({page}) => {
        await addResultsTestFile('invalid.txt', page);
        // THEN:
        //   Warning message shown
        //   No file added
        await expect(page.getByText('loaded file')).toBeVisible();
        await expect(page.getByText('loaded file')).toContainText("0");
    })

})

test.describe("Valid results file types", () => {

// xml v3 standard no data
// xml v3 standard one class no data
// xml v3 standard one class one result
// xml v3 standard many classes various results
// repeat for: xml v3 *splits*
// OEScore V12 CSV

    test.beforeEach(async ({page}) => {
        await page.goto('/results');
    });

    test('ResultList xml v3 splits', async ({page}) => {
        await addResultsTestFile('ResultsByClassX3_FromOE11.xml', page);
        // THEN:
        //   1 Loaded file
        //   File Name displayed
        await expect(page.getByText('loaded file')).toContainText("1");
        await expect(page.getByText('ResultsByClassX3_FromOE11.xml')).toBeVisible;
    })

    test('OEScore V11 csv', async({page}) => {
        await addResultsTestFile('OEScore_V11.csv', page);
        await expect(page.getByText('loaded file')).toContainText("1");
        await expect(page.getByText('OEScore_V11.csv')).toBeVisible;
    })

    test('OEScore V12 csv', async({page}) => {
        await addResultsTestFile('OEScore_V12.csv', page);
        await expect(page.getByText('loaded file')).toContainText("1");
        await expect(page.getByText('OEScore_V12.csv')).toBeVisible;
    })
})