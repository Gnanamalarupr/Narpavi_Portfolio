import { readCollection, writeCollection } from './jsonStore.service.js';
const file = 'site.json';
export const getSite = () => readCollection(file);
export const updateSite = async (data) => { const current = await getSite(); const next = { ...current, ...data }; await writeCollection(file, next); return next; };
