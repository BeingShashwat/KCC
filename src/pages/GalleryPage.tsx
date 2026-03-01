import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_IMAGES, HIGHLIGHT_VIDEO } from '@/lib/constants';

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const goNext = useCallback(() => {
    if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % GALLERY_IMAGES.length);
  }, [selectedIndex]);

  const goPrev = useCallback(() => {
    if (selectedIndex !== null) setSelectedIndex((selectedIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  }, [selectedIndex]);

  return (
    <div className="page-container">
      <div className="section-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="section-title mb-4">
            <span className="gradient-text">📸 Season 1 Gallery</span>
          </h1>
          <p className="section-subtitle mx-auto">
            सीज़न 1 की यादगार तस्वीरें • ठेंगहा नाइट क्रिकेट टूर्नामेंट 2025
          </p>
        </motion.div>

        {/* Highlight Video */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-4xl mx-auto mb-20">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-6 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            🎬 Highlight Video
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: 'var(--color-border)' }}>
            <video controls preload="metadata" poster={GALLERY_IMAGES[0]} className="w-full aspect-video bg-black outline-none">
              <source src={HIGHLIGHT_VIDEO} type="video/mp4" />
            </video>
          </div>
        </motion.div>

        {/* Photo Count */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            📷 Viewing {GALLERY_IMAGES.length} Photos
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-16">
          {GALLERY_IMAGES.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
              className="relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer group bg-black/5 dark:bg-white/5"
              onClick={() => setSelectedIndex(i)}
            >
              <img
                src={src}
                alt={`KCC Season 1 - Photo ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)' }}
            onClick={() => setSelectedIndex(null)}
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors border-none cursor-pointer"
            >
              <X size={28} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-10 p-3 sm:p-4 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors border-none cursor-pointer"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-10 p-3 sm:p-4 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors border-none cursor-pointer"
            >
              <ChevronRight size={32} />
            </button>

            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={GALLERY_IMAGES[selectedIndex]}
              alt={`Season 1 - Photo ${selectedIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-bold tracking-widest">
              {selectedIndex + 1} / {GALLERY_IMAGES.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}