import * as catalog from '../services/catalog.service.js';
const safeImage = (req) => req.file ? `/uploads/${req.file.filename}` : req.body.image;
const normalise = (data) => ({ ...data, ...(data.features ? { features: typeof data.features === 'string' ? JSON.parse(data.features) : data.features } : {}) });
export const list = (file) => async (_, res, next) => { try { res.json({ success: true, data: await catalog.list(file) }); } catch (e) { next(e); } };
export const create = (file) => async (req, res, next) => { try { const image = safeImage(req); if (!image) return res.status(400).json({ success: false, message: 'An image URL or upload is required.' }); res.status(201).json({ success: true, data: await catalog.create(file, { ...normalise(req.body), image }) }); } catch (e) { next(e); } };
export const update = (file) => async (req, res, next) => { try { const image = safeImage(req); res.json({ success: true, data: await catalog.update(file, req.params.id, { ...normalise(req.body), ...(image ? { image } : {}) }) }); } catch (e) { next(e); } };
export const remove = (file) => async (req, res, next) => { try { await catalog.remove(file, req.params.id); res.json({ success: true }); } catch (e) { next(e); } };
