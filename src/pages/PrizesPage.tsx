import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRIZES, SPECIAL_AWARDS, RULES, TOURNAMENT_INFO } from '@/lib/constants';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15 } } };

export default function PrizesPage() {
  return (
    <div className="page-container">
      <div className="section-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-24">
          <h1 className="section-title mb-6">
            <span className="gradient-text-gold">🏆 पुरस्कार एवं नियम</span>
          </h1>
          <p className="section-subtitle mx-auto text-lg leading-relaxed">Prizes, Awards & Rules • कुल ₹1,00,000+ की पुरस्कार राशि</p>
        </motion.div>

        {/* TOP 3 */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-24">
          {PRIZES.map((prize, i) => (
            <motion.div key={i} variants={fadeUp} className={`glass-card glass-card-hover p-10 sm:p-12 text-center flex flex-col justify-center items-center ${prize.bg} ${prize.border}`}>
              <div className="text-7xl mb-6">{prize.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 leading-snug" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>{prize.title}</h3>
              <p className="text-sm font-medium tracking-wider uppercase mb-8 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{prize.titleEn}</p>
              <div className={`text-5xl sm:text-6xl font-black tracking-tight ${prize.textColor}`} style={{ fontFamily: 'var(--font-heading)' }}>{prize.amount}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* SPECIAL AWARDS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-24">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-14 leading-snug" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            ✨ विशेष पुरस्कार • Special Awards
          </h2>
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
            {SPECIAL_AWARDS.map((award, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-card glass-card-hover p-6 sm:p-8 text-center flex flex-col items-center">
                <div className="text-4xl mb-4">{award.icon}</div>
                <h4 className="text-sm sm:text-base font-bold mb-2 leading-snug" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>{award.title}</h4>
                <p className="text-xs font-medium mb-5 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{award.titleEn}</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-auto" style={{ fontFamily: 'var(--font-heading)' }}>{award.amount}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* RULES */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-3xl mx-auto mb-20">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-12 leading-snug" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            📋 नियम एवं शर्तें • Rules & Regulations
          </h2>

          <div className="glass-card p-8 sm:p-12">
            <div className="space-y-7">
              {RULES.map((rule, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.05 }} className="flex items-start gap-4">
                  <CheckCircle size={22} className="text-emerald-500 flex-shrink-0 mt-1" />
                  <span className="text-base sm:text-lg leading-loose font-medium" style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-text-secondary)' }}>{rule}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex flex-col sm:flex-row items-start gap-4">
              <AlertCircle size={28} className="text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-3 leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>महत्वपूर्ण सूचना</p>
                <p className="text-sm sm:text-base leading-loose font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  एंट्री फीस <strong>{TOURNAMENT_INFO.entryFeeDisplay}</strong> पूरी जमा करना अनिवार्य है।
                  अंतिम तिथि <span className="text-red-500 font-bold">{TOURNAMENT_INFO.lastRegistrationDate}</span>।
                  एक आधार नंबर से केवल एक ही टीम में रजिस्ट्रेशन हो सकता है।
                  कुल <strong>{TOURNAMENT_INFO.maxTeams}</strong> टीमों की सीमा है।
                  <br /><br />
                  ऑफलाइन पेमेंट: <strong>{TOURNAMENT_INFO.offlinePaymentAddress}</strong>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center pb-10">
          <Link to="/register" className="btn-gold text-lg py-4 px-10">🏏 Register Your Team</Link>
        </div>
      </div>
    </div>
  );
}