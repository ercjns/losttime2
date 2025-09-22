import { Download, Page } from "@playwright/test";
import path from "path";


async function setTestFile(directory:string, name:string, page:Page) {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', {name: "drop"}).click();
    const fileChooser = await fileChooserPromise;
    const filePath:string = path.join(__dirname, 'files', directory, name)
    await fileChooser.setFiles(filePath);
}

export async function addEntriesTestFile(name:string, page:Page) {
    setTestFile('entries', name, page);
}

export async function addResultsTestFile(name:string, page:Page) {
    await setTestFile('results', name, page);
}

export async function saveAsSuggested(download:Promise<Download>):Promise<string> {
    const dl = await download;
    const dlPath = path.join(__dirname, 'temp',dl.suggestedFilename());
    await dl.saveAs(dlPath);
    return dlPath;
}

function getFilePath(directory:string, name:string):string {
    return path.join(__dirname, 'files', directory, name)
}

export function getEntriesFilePath(name:string):string {
    return getFilePath('entries', name);
}