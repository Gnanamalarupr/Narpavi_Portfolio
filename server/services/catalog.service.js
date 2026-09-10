import { readCollection, writeCollection, makeId } from './jsonStore.service.js';
export const list = (file) => readCollection(file);
export const create = async (file, data) => { const items = await readCollection(file); const item = { id: makeId(), ...data }; items.unshift(item); await writeCollection(file, items); return item; };
export const update = async (file, id, data) => { const items = await readCollection(file); const index = items.findIndex((item) => item.id === id); if (index < 0) { const error = new Error('Item not found'); error.status = 404; throw error; } items[index] = { ...items[index], ...data, id }; await writeCollection(file, items); return items[index]; };
export const remove = async (file, id) => { const items = await readCollection(file); const next = items.filter((item) => item.id !== id); if (next.length === items.length) { const error = new Error('Item not found'); error.status = 404; throw error; } await writeCollection(file, next); };
