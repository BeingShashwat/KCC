import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, Users, ChevronDown, Phone, Shield, UserCheck } from 'lucide-react';
import Countdown from '@/components/Countdown';
import { TOURNAMENT_INFO, CONTACTS, PRIZES, GALLERY_IMAGES, HIGHLIGHT_VIDEO_YT } from '@/lib/constants';
import { getVerifiedTeams, getVerifiedTeamCount } from '@/lib/supabase';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

export default function HomePage() {
  const [teams, setTeams] = useState<{ team_name: string; captain_name: string }[]>([]);
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    getVerifiedTeams().then(setTeams);
    getVerifiedTeamCount().then(setTeamCount);
  }, []);

  const spotsLeft = TOURNAMENT_INFO.maxTeams - teamCount;

  return (
    <div className="relative">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-5" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-transparent to-transparent dark:from-emerald-950/20 dark:via-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/[0.03] dark:bg-emerald-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', damping: 15 }}
            className="flex justify-center mb-8"
          >
            <img
              src="/logo.png"
              alt="KCC Logo"
              className="w-28 h-28 sm:w-40 sm:h-40 rounded-3xl object-contain shadow-2xl logo-glow"
              loading="eager"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 mb-10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>
              {TOURNAMENT_INFO.season} • Registrations Open
            </span>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-sm font-bold tracking-[0.25em] uppercase mb-6" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}>
            KCC Presents
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ fontFamily: 'var(--font-heading)' }} className="text-5xl sm:text-7xl md:text-8xl font-black leading-tight mb-6 tracking-tight">
            <span className="gradient-text">THENGAHA</span>
          </motion.h1>

          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }} className="text-2xl sm:text-4xl md:text-5xl font-bold mb-8">
            Minus Boundary Night Cricket Tournament
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-lg sm:text-2xl font-bold text-amber-600 dark:text-amber-500 mb-14 leading-relaxed" style={{ fontFamily: 'var(--font-accent)' }}>
            {TOURNAMENT_INFO.nameHindi}
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-wrap justify-center gap-4 sm:gap-5 mb-16">
            {[
              { icon: <Calendar size={16} />, label: TOURNAMENT_INFO.startDateHindi },
              { icon: <Trophy size={16} />, label: `प्रथम पुरस्कार ₹51,000` },
              { icon: <MapPin size={16} />, label: TOURNAMENT_INFO.venueEn },
              { icon: <Users size={16} />, label: `Entry ${TOURNAMENT_INFO.entryFeeDisplay}` },
            ].map((chip, i) => (
              <div key={i} className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl glass-card text-sm font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="text-emerald-600 dark:text-emerald-400">{chip.icon}</span>
                {chip.label}
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="mb-18">
            <Countdown targetDate={TOURNAMENT_INFO.startDate} />
          </motion.div>

          {spotsLeft > 0 && spotsLeft <= 10 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold mb-12 leading-relaxed">
              🔥 Only {spotsLeft} spots left out of {TOURNAMENT_INFO.maxTeams}!
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 mb-14">
            <Link to="/register" className="btn-gold w-full sm:w-auto text-lg py-4 px-8">
              🏏 Register Your Team
            </Link>
            <Link to="/prizes" className="btn-outline w-full sm:w-auto text-lg py-4 px-8">
              View Prizes & Details →
            </Link>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-sm sm:text-base font-medium leading-loose" style={{ color: 'var(--color-text-muted)' }}>
            एंट्री फीस: <span className="text-amber-600 dark:text-amber-400 font-bold">{TOURNAMENT_INFO.entryFeeDisplay}</span>{' '}
            • अंतिम तिथि: <span className="text-red-500 font-bold">{TOURNAMENT_INFO.lastRegistrationDate}</span>
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> • </span> कुल <span className="font-bold">{TOURNAMENT_INFO.maxTeams}</span> टीमें
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
            <ChevronDown size={32} style={{ color: 'var(--color-text-muted)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== REGISTERED TEAMS ===== */}
      {teams.length > 0 && (
        <section id="teams" className="py-24" style={{ background: 'var(--color-bg-secondary)' }}>
          <div className="section-container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} transition={{ duration: 0.6 }}>
              <h2 className="section-title text-center mb-4">
                <span className="gradient-text">✅ रजिस्टर्ड टीमें</span>
              </h2>
              <p className="section-subtitle text-center mx-auto mb-8">
                Registered Teams • {teamCount} / {TOURNAMENT_INFO.maxTeams}
              </p>

              <div className="max-w-xl mx-auto mb-16">
                <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-input)' }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${(teamCount / TOURNAMENT_INFO.maxTeams) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                </div>
                <p className="text-center text-sm mt-3 font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                  {spotsLeft > 0 ? `${spotsLeft} spots remaining` : '🚫 Registration Closed'}
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {teams.map((team, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} className="glass-card p-5 flex items-center gap-4 hover:border-emerald-500/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-lg flex-shrink-0" style={{ fontFamily: 'var(--font-heading)' }}>
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-base truncate mb-1" style={{ color: 'var(--color-text-primary)' }}>{team.team_name}</p>
                    <p className="text-xs sm:text-sm flex items-center gap-1.5 truncate font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      <UserCheck size={14} /> {team.captain_name}
                    </p>
                  </div>
                  <Shield size={20} className="text-emerald-500 flex-shrink-0 opacity-80" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== VIDEO ===== */}
      <section className="py-24">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="section-title text-center mb-4">
              <span className="gradient-text">🎬 Season 1 Highlights</span>
            </h2>
            <p className="section-subtitle text-center mx-auto mb-16">
              ठेंगहा नाइट क्रिकेट टूर्नामेंट 2025 की झलकियाँ
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: 'var(--color-border)' }}>
              <iframe
                src={HIGHLIGHT_VIDEO_YT}
                title="Season 1 Highlights"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video bg-black"
                style={{ border: 'none' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== PRIZES PREVIEW ===== */}
      <section className="py-24" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="section-title text-center mb-4">
              <span className="gradient-text-gold">🏆 पुरस्कार राशि</span>
            </h2>
            <p className="section-subtitle text-center mx-auto mb-16">Prize Money • कुल ₹1,00,000+</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mb-12">
            {PRIZES.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className={`glass-card glass-card-hover p-10 text-center ${p.bg} ${p.border}`}>
                <div className="text-5xl mb-5">{p.icon}</div>
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>{p.title}</h3>
                <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>{p.titleEn}</p>
                <p className={`text-4xl sm:text-5xl font-black ${p.textColor}`} style={{ fontFamily: 'var(--font-heading)' }}>{p.amount}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/prizes" className="btn-outline text-lg py-4 px-8">View All Prizes & Rules →</Link>
          </div>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className="py-24">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="section-title text-center mb-4">
              <span className="gradient-text">📸 Season 1 Moments</span>
            </h2>
            <p className="section-subtitle text-center mx-auto mb-16">सीज़न 1 की यादगार तस्वीरें</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-12">
            {GALLERY_IMAGES.slice(0, 8).map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-black/5 dark:bg-white/5 group">
                <img src={src} alt={`Season 1 - ${i + 1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/gallery" className="btn-outline text-lg py-4 px-8">View All {GALLERY_IMAGES.length} Photos →</Link>
          </div>
        </div>
      </section>

      {/* ===== CONTACTS ===== */}
      <section className="py-24" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="section-title text-center mb-4">
              <span className="gradient-text">📞 संपर्क करें</span>
            </h2>
            <p className="section-subtitle text-center mx-auto mb-16">Contact Us</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-8 sm:p-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-8" style={{ fontFamily: 'var(--font-heading)' }}>🎫 एंट्री जमा करने के लिए</h3>
              <div className="space-y-4">
                {CONTACTS.entry.map((c, i) => (
                  <a key={i} href={`tel:+91${c.phone}`} className="flex items-center justify-between p-5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition-colors no-underline">
                    <div>
                      <p className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>{c.name}</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{c.nameEn}</p>
                    </div>
                    <div className="flex items-center gap-2 text-base font-semibold text-emerald-600 dark:text-emerald-400">
                      <Phone size={16} /> {c.phone}
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-8 sm:p-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-8" style={{ fontFamily: 'var(--font-heading)' }}>ℹ️ जानकारी के लिए</h3>
              <div className="space-y-4">
                {CONTACTS.info.map((c, i) => (
                  <a key={i} href={`tel:+91${c.phone}`} className="flex items-center justify-between p-5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition-colors no-underline">
                    <div>
                      <p className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>{c.name}</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{c.nameEn}</p>
                    </div>
                    <div className="flex items-center gap-2 text-base font-semibold text-emerald-600 dark:text-emerald-400">
                      <Phone size={16} /> {c.phone}
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24">
        <div className="section-container text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-5xl font-black mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              अपनी टीम रजिस्टर करें! 🏏
            </h2>
            <p className="text-base sm:text-lg mb-12 max-w-lg mx-auto font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              अंतिम तिथि <span className="text-red-500 font-bold">{TOURNAMENT_INFO.lastRegistrationDate}</span> • एंट्री फीस{' '}
              <span className="text-amber-600 dark:text-amber-400 font-bold">{TOURNAMENT_INFO.entryFeeDisplay}</span>
            </p>
            <Link to="/register" className="btn-gold text-lg py-4 px-10">
              🏏 Register Now - {TOURNAMENT_INFO.entryFeeDisplay}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}