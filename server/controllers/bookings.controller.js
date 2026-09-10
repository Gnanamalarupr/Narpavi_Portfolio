import * as bookings from '../services/booking.service.js';
export const getAll = async (_,res,next) => { try { res.json({success:true,data:await bookings.allBookings()}); }catch(e){next(e)} };
export const create = async (req,res,next) => { try { const required=['name','phone','email','eventType','date','time']; if(required.some(k=>!req.body[k])) return res.status(400).json({success:false,message:'Please complete all required booking fields.'}); res.status(201).json({success:true,data:await bookings.createBooking(req.body)}); }catch(e){next(e)} };
