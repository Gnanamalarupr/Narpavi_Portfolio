import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import useSiteContent from '../hooks/useSiteContent';

const images = [
  'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=800&q=85'
];

export default function Home() {
  const site = useSiteContent();
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <section className="relative min-h-[680px] overflow-hidden bg-[#e8d4cf]">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1800&q=90')] bg-cover bg-center opacity-35" />
      <div className="section relative flex min-h-[680px] items-center"><div className="max-w-2xl">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="eyebrow mb-5">{site.heroEyebrow}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} className="display text-5xl leading-[1.05] md:text-7xl">{site.heroTitle}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }} className="mt-6 max-w-lg leading-7 text-[#625354]">{site.heroText}</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }} className="mt-8 flex flex-wrap gap-3"><Link to="/contact#booking" className="btn-primary">Reserve your date <FaArrowRight /></Link><Link to="/portfolio" className="btn-light">View our work</Link></motion.div>
      </div></div>
      <div className="absolute bottom-8 right-5 hidden rounded-2xl bg-white/75 p-4 backdrop-blur md:block"><div className="flex gap-1 text-gold">★★★★★</div><p className="mt-1 text-xs">Loved by 300+ brides</p></div>
    </section>
    <section className="section grid gap-12 md:grid-cols-2 md:items-center"><img loading="lazy" className="h-[500px] w-full rounded-[2rem] object-cover shadow-soft" src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df2?auto=format&fit=crop&w=1000&q=85" /><div><p className="eyebrow">The Maison Rosé approach</p><h2 className="display mt-3 text-4xl md:text-5xl">{site.homeIntroTitle}</h2><p className="mt-5 leading-7 text-[#786869]">{site.homeIntroText}</p><Link to="/about" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-rose">More about the artist <FaArrowRight /></Link></div></section>
    <section className="bg-blush/45"><div className="section"><SectionTitle eyebrow="A little lookbook" title="Beauty, in all its moods." text="From soft bridal radiance to after-dark glamour." /><div className="grid gap-5 md:grid-cols-3">{images.map((image, index) => <img key={image} loading="lazy" src={image} className={`w-full rounded-[1.5rem] object-cover ${index === 1 ? 'h-96' : 'h-80'}`} />)}</div></div></section>
    <section className="section text-center"><p className="eyebrow">Your moment, your way</p><h2 className="display mx-auto mt-3 max-w-3xl text-4xl md:text-5xl">{site.homeCtaTitle}</h2><Link to="/contact#booking" className="btn-primary mt-8">Start a conversation <FaArrowRight /></Link></section>
  </motion.div>;
}
