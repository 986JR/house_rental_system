import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, ShieldCheck, ArrowRight, Star, CheckCircle2, Bed, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const FeaturedCard = ({ prop, index }) => (
  <motion.div variants={fadeUp}>
    <Link to={`/properties/${prop.id}`} className="property-card group h-full block">
      <div className="relative h-56 overflow-hidden">
        <img
          src={prop.images?.[0]?.filePath || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800'}
          alt={prop.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`badge ${prop.availability === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {prop.availability === 'available' ? '● Available' : '● Rented'}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-2xl font-extrabold">${prop.pricePerMonth?.toLocaleString()}</p>
          <p className="text-xs opacity-80 font-medium">per month</p>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">{prop.title}</h3>
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mb-4">
          <MapPin size={14} className="text-primary-500 shrink-0" />
          <span className="line-clamp-1">{prop.location}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Bed size={16} className="text-primary-500" />
            <span>{prop.rooms} {prop.rooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/properties?availability=available')
      .then(res => setFeatured((res.data.content || []).slice(0, 3)))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative pt-16 pb-32 md:pt-28 md:pb-48 overflow-hidden">
        {/* BG blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary-400/20 blur-[120px]" />
          <div className="absolute bottom-[0%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-400/20 blur-[120px]" />
        </div>

        <div className="container">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400"
            >
              <Star size={13} className="text-amber-400 fill-amber-400" /> Trusted by 10,000+ Renters Worldwide
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold leading-[1.05] text-slate-950 dark:text-white"
            >
              The Smarter Way to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">
                Find Home.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl"
            >
              Discover verified premium properties. Connect directly with landlords. Move in with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link to="/properties" className="btn-primary !px-10 !py-4 text-base sm:text-lg w-full sm:w-auto justify-center">
                Browse Properties <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="btn-secondary !px-10 !py-4 text-base sm:text-lg w-full sm:w-auto justify-center">
                List Your Property
              </Link>
            </motion.div>
          </div>

          {/* Hero image with stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
                alt="Luxury Home"
                className="w-full aspect-[16/7] sm:aspect-[21/9] object-cover"
              />
            </div>

            {/* Floating stats bar */}
            <div className="absolute -bottom-8 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-max">
              <div className="glass-card px-8 py-5 flex flex-wrap justify-center sm:justify-start gap-8 sm:gap-12">
                {[
                  { v: '1,200+', l: 'Active Listings' },
                  { v: '8.5k',  l: 'Happy Tenants'   },
                  { v: '450+',  l: 'Verified Owners'  },
                ].map(s => (
                  <div key={s.l} className="text-center">
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{s.v}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="section bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-4">Why RentalHub</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-slate-950 dark:text-white leading-tight">Built for the<br />Modern Renter.</h2>
              <div className="space-y-8">
                {[
                  { Icon: Search,       title: 'Intelligent Search',    desc: 'Advanced filters help you pinpoint properties matching your exact lifestyle and budget.' },
                  { Icon: ShieldCheck,  title: 'Fully Verified',        desc: 'Every listing and landlord goes through our rigorous verification process for your peace of mind.' },
                  { Icon: Building2,    title: 'Complete Management',   desc: 'Manage your entire rental journey — from inquiry to monthly payments — in one seamless hub.' },
                ].map(({ Icon, title, desc }) => (
                  <div key={title} className="flex gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center shrink-0 mt-1">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1.5 text-slate-900 dark:text-white">{title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600607687940-4e7a6a953c1b?auto=format&fit=crop&q=80&w=1200"
                  alt="Interior"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
              <div className="absolute -top-5 -right-5 glass-card p-4 rounded-2xl animate-pulse-slow hidden sm:block">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Available Now</p>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 glass-card p-4 rounded-2xl hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-600 text-white text-sm font-bold flex items-center justify-center">4.9</div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Top Rated</p>
                    <p className="text-[10px] text-slate-400">1,200+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Properties ───────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">Hand-Picked</p>
              <h2 className="text-4xl font-bold text-slate-950 dark:text-white">Featured Listings</h2>
            </div>
            <Link to="/properties" className="btn-secondary !py-2.5 !px-5 text-sm self-start sm:self-auto">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featured.map((prop, i) => <FeaturedCard key={prop.id} prop={prop} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="section container">
        <div className="bg-primary-600 rounded-4xl sm:rounded-5xl p-10 sm:p-16 md:p-24 text-center relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              Ready to find your <br className="hidden sm:block" /> dream space?
            </h2>
            <p className="text-primary-100 text-lg mb-10 leading-relaxed">
              Join thousands of happy tenants and discover the place you've always wanted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-50 transition-colors shadow-xl w-full sm:w-auto">
                Get Started Free
              </Link>
              <Link to="/properties" className="bg-primary-700 text-white border border-primary-500 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-800 transition-colors w-full sm:w-auto">
                Browse Houses
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
