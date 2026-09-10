import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const base = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
export const readCollection = async (file) => JSON.parse(await fs.readFile(path.join(base, file), 'utf8'));
export const writeCollection = async (file, items) => fs.writeFile(path.join(base, file), JSON.stringify(items, null, 2));
export const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
