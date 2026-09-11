import * as reviews from '../services/review.service.js';

const withImageUrl = (req, items) => {
	const origin = `${req.protocol}://${req.get('host')}`;
	return items.map((item) => {
		const review = item.toJSON ? item.toJSON() : item;
		return { ...review, image: review.image?.startsWith('/') ? `${origin}${review.image}` : review.image || '' };
	});
};
export const getApproved = async (req, res, next) => { try { const data = withImageUrl(req, await reviews.approvedReviews()); res.json({ success: true, data, meta: { averageRating: data.length ? +(data.reduce((a,r)=>a+r.rating,0)/data.length).toFixed(1) : 0, total: data.length } }); } catch(e){next(e)} };
export const getPending = async (req, res, next) => { try { res.json({ success:true, data: withImageUrl(req, await reviews.pendingReviews()) }); } catch(e){next(e)} };
export const create = async (req,res,next) => { try { const { name, city, rating, title, description } = req.body; if (!name || !city || !rating || !title || !description) return res.status(400).json({ success:false, message:'Please complete all required review fields.' }); if (+rating < 1 || +rating > 5) return res.status(400).json({success:false,message:'Rating must be between 1 and 5.'}); const image = req.file ? `/uploads/${req.file.filename}` : ''; const review = await reviews.createReview({ ...req.body, image }); res.status(201).json({success:true,data:{ ...review, image: image ? `${req.protocol}://${req.get('host')}${image}` : '' }}); }catch(e){next(e)} };
export const approve = async (req,res,next) => { try { res.json({success:true,data:await reviews.setReviewStatus(req.params.id,'approved')}); }catch(e){next(e)} };
export const reject = async (req,res,next) => { try { res.json({success:true,data:await reviews.setReviewStatus(req.params.id,'rejected')}); }catch(e){next(e)} };
