import { readFile } from 'node:fs/promises';
export async function loadPrompt(name) {

    const promptUrl = new URL('../prompts/' + name, import.meta.url);


    return await readFile(promptUrl, 'utf-8');
}

