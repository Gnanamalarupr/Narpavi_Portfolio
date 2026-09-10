import * as site from '../services/site.service.js';
export const get = async (_, res, next) => { try { res.json({ success: true, data: await site.getSite() }); } catch (e) { next(e); } };
export const update = async (req, res, next) => { try { res.json({ success: true, data: await site.updateSite(req.body) }); } catch (e) { next(e); } };
