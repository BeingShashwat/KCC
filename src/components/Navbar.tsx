import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Sun, Moon, Shield } from 'lucide-react';
import { CONTACTS } from '@/lib/constants';
import { useTheme } from '@/lib/theme';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    // Scroll to hash if present, otherwise scroll to top
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Teams', to: '/#teams' },
    { label: 'Prizes', to: '/prizes' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Register', to: '/register' },
  ];

  const isActive = (to: string) => {
    if (to.includes('#')) return location.pathname + location.hash === to;
    return location.pathname === to;
  };

  const handleNavClick = (to: string, e: React.MouseEvent) => {
    if (to.includes('#')) {
      e.preventDefault();
      const [path, hash] = to.split('#');
      if (location.pathname === path || (path === '/' && location.pathname === '/')) {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(to);
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-300 border-b shadow-sm ${
          isScrolled ? 'py-3' : 'py-4 sm:py-5'
        }`}
        style={{
          background: 'var(--color-bg-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 no-underline outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-500">
            <img src="/logo.png" alt="KCC Logo" className="w-10 h-10 rounded-full object-contain shadow-md" />
            <div className="hidden sm:flex flex-col">
              <span className="text-base font-bold leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                KCC
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide">
                SEASON 2
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={(e) => handleNavClick(link.to, e)}
                className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 no-underline ${
                  isActive(link.to)
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'hover:bg-black/[0.04] dark:hover:bg-white/5'
                }`}
                style={{ fontFamily: 'var(--font-body)', color: isActive(link.to) ? undefined : 'var(--color-text-secondary)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/5 transition-colors border-none cursor-pointer bg-transparent flex items-center justify-center"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Admin */}
            <Link
              to="/admin"
              className="p-2.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/5 transition-colors flex items-center justify-center no-underline"
              style={{ color: 'var(--color-text-muted)' }}
              title="Admin Panel"
            >
              <Shield size={18} />
            </Link>

            {/* Phone */}
            <a
              href={`tel:+91${CONTACTS.primary}`}
              className="hidden sm:flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors no-underline p-2"
            >
              <Phone size={16} />
              <span className="font-semibold">{CONTACTS.primary}</span>
            </a>

            {/* Register CTA */}
            <Link to="/register" className="btn-primary !py-2.5 !px-6 !text-sm hidden md:flex">
              Register
            </Link>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2.5 -mr-2 bg-transparent border-none cursor-pointer flex items-center justify-center rounded-full hover:bg-black/[0.04] dark:hover:bg-white/5"
              style={{ color: 'var(--color-text-primary)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[70px] inset-x-0 z-40 border-b shadow-lg"
            style={{ background: 'var(--color-bg-glass)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderColor: 'var(--color-border)' }}
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={(e) => handleNavClick(link.to, e)}
                  className={`w-full text-left px-5 py-4 text-base font-medium rounded-xl transition-all no-underline block ${
                    isActive(link.to) ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : ''
                  }`}
                  style={{ color: isActive(link.to) ? undefined : 'var(--color-text-secondary)' }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px w-full my-4" style={{ background: 'var(--color-border)' }} />
              <a href={`tel:+91${CONTACTS.primary}`} className="flex items-center justify-center gap-3 px-5 py-4 text-base font-semibold text-emerald-600 dark:text-emerald-400 no-underline bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                <Phone size={18} /> Call Us: {CONTACTS.primary}
              </a>
              <Link to="/admin" className="flex items-center justify-center gap-3 px-5 py-4 text-base font-semibold no-underline rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/5 transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                <Shield size={18} /> Admin Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}