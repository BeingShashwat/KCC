import { motion } from 'framer-motion';
import { Phone, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TOURNAMENT_INFO, CONTACTS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="py-16 border-t mt-auto" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Logo */}
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <img src="/logo.png" alt="KCC Logo" className="w-14 h-14 rounded-full object-contain shadow-md" />
            <div>
              <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {TOURNAMENT_INFO.name}
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                KCC • {TOURNAMENT_INFO.organizerHindi} • {TOURNAMENT_INFO.season}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8">
            {[
              { label: 'Home', to: '/' },
              { label: 'Teams', to: '/#teams' },
              { label: 'Prizes', to: '/prizes' },
              { label: 'Gallery', to: '/gallery' },
              { label: 'Register', to: '/register' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors no-underline p-2 -m-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-10">
            <a href={`tel:+91${CONTACTS.primary}`} className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 no-underline p-2 -m-2">
              <Phone size={16} />
              {CONTACTS.primary}
            </a>
            <a href="https://wa.me/919984671212" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 no-underline p-2 -m-2">
              💬 WhatsApp
            </a>
            <a href={TOURNAMENT_INFO.locationLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm no-underline p-2 -m-2 hover:underline" style={{ color: 'var(--color-text-muted)' }}>
              <MapPin size={16} />
              {TOURNAMENT_INFO.venueEn}
            </a>
          </div>

          {/* Divider */}
          <div className="w-24 h-px mx-auto mb-6" style={{ background: 'var(--color-border)' }} />

          <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
            © {TOURNAMENT_INFO.year} {TOURNAMENT_INFO.organizerFull}. All rights reserved.
          </p>
          <p className="text-xs flex items-center justify-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
            Made with <Heart size={12} className="text-red-500" /> for KCC
          </p>
        </motion.div>
      </div>
    </footer>
  );
}