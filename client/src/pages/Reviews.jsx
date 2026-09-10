import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import Stars from '../components/Stars';
import { reviewsApi } from '../services/api';

const emptyForm = { name: '', city: '', rating: 5, title: '', description: '', image: '' };

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState({ averageRating: 0, total: 0 });
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const loadReviews = async () => {
    try {
      const response = await reviewsApi.get();
      setReviews(response.data.data);
      setMeta(response.data.meta);
    } catch {
      setMessage('Unable to load reviews just now.');
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (file) payload.append('imageFile', file);
      await reviewsApi.create(payload);
      setMessage('Thank you—your review is now awaiting approval.');
      setForm(emptyForm);
      setFile(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to send review.');
    } finally { setSending(false); }
  };

  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <section className="bg-blush/55"><div className="section text-center">
      <p className="eyebrow">Client love</p><h1 className="display mt-3 text-5xl">Words from the chair.</h1>
      <div className="mx-auto mt-8 flex max-w-sm justify-center gap-8 rounded-2xl bg-white p-5 shadow-soft"><div><p className="display text-3xl text-rose">{meta.averageRating || '—'}</p><Stars value={Math.round(meta.averageRating)} /></div><div className="border-l border-[#eaded8] pl-8"><p className="display text-3xl text-rose">{meta.total}</p><p className="text-xs uppercase tracking-wider">Approved reviews</p></div></div>
    </div></section>
    <section className="section grid gap-14 lg:grid-cols-[1.1fr_.9fr]"><div>
      <SectionTitle eyebrow="Testimonials" title="A beautiful beginning." />
      {reviews.map((review) => <article className="mb-5 rounded-2xl border border-[#eaded8] bg-white p-6" key={review.id}><div className="flex items-start justify-between"><FaQuoteLeft className="text-blush text-2xl" />{review.image && <img src={review.image} alt="" className="h-12 w-12 rounded-full object-cover" />}</div><Stars value={review.rating} /><h2 className="display mt-3 text-2xl">{review.title}</h2><p className="mt-3 leading-7 text-[#786869]">“{review.description}”</p><p className="mt-4 text-sm font-bold">{review.name} <span className="font-normal text-[#8d7b7a]">· {review.city}</span></p></article>)}
    </div><div className="card h-fit p-7"><h2 className="display text-3xl">Share your experience</h2><p className="mt-2 text-sm text-[#786869]">Your review will appear once it has been approved.</p>
      <form onSubmit={submit} className="mt-6 space-y-4"><div className="grid grid-cols-2 gap-3"><input required className="field" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input required className="field" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div><div><label className="mb-2 block text-sm">Your rating</label><Stars value={form.rating} onChange={(rating) => setForm({ ...form, rating })} /></div><input required className="field" placeholder="Review title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><textarea required className="field min-h-28" placeholder="Tell us a little about your experience" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><input type="file" accept="image/*" className="text-xs" onChange={(e) => { const selectedFile = e.target.files[0]; if (selectedFile) { setFile(selectedFile); setForm({ ...form, image: URL.createObjectURL(selectedFile) }); } }} />{form.image && <img src={form.image} alt="Review preview" className="h-12 w-12 rounded-full object-cover" />}<button disabled={sending} className="btn-primary w-full">{sending ? 'Sending…' : 'Submit review'}</button>{message && <p className="text-center text-sm text-rose">{message}</p>}</form>
    </div></section>
  </motion.div>;
}
