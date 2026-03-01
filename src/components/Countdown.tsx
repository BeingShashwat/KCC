import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(targetDate));

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  const items = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Mins' },
    { value: timeLeft.seconds, label: 'Secs' },
  ];

  return (
    <div className="text-center">
      <p
        className="text-xs sm:text-sm uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400/80 mb-8 font-semibold leading-relaxed"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        Tournament Starts In
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center gap-3 sm:gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="glass-card px-4 py-4 sm:px-6 sm:py-5 min-w-[70px] sm:min-w-[96px] flex flex-col items-center justify-center">
                <motion.div
                  key={item.value}
                  initial={{ y: -6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="countdown-value gradient-text"
                >
                  {String(item.value).padStart(2, '0')}
                </motion.div>
                <div className="countdown-label mt-2 font-medium tracking-widest">{item.label}</div>
              </div>
            </motion.div>
            {i < items.length - 1 && (
              <span className="text-2xl sm:text-3xl font-bold -mt-4" style={{ color: 'var(--color-text-muted)' }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}