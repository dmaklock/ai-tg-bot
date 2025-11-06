import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const PROMPT_FILE_PATH = join(process.cwd(), 'prompts', 'system-prompt.txt');

export function readSystemPrompt(): string {
  try {
    if (existsSync(PROMPT_FILE_PATH)) {
      return readFileSync(PROMPT_FILE_PATH, 'utf-8');
    }
    return '';
  } catch (error) {
    console.error('Error reading system prompt:', error);
    return '';
  }
}

export function writeSystemPrompt(prompt: string): void {
  try {
    writeFileSync(PROMPT_FILE_PATH, prompt, 'utf-8');
  } catch (error) {
    console.error('Error writing system prompt:', error);
    throw error;
  }
}


