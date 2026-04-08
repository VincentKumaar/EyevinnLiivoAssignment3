import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDirectory(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  await ensureDirectory();
  const absolutePath = path.join(DATA_DIR, fileName);

  try {
    const rawData = await readFile(absolutePath, 'utf-8');
    return JSON.parse(rawData) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile<T>(fileName: string, value: T): Promise<void> {
  await ensureDirectory();
  const absolutePath = path.join(DATA_DIR, fileName);
  await writeFile(absolutePath, JSON.stringify(value, null, 2), 'utf-8');
}
