'use client';

import { PrayerItem } from '@/types';
import { formatCountdown } from '@/lib/api';
import { Clock } from 'lucide-react';

interface NextPrayerCardProps {
  nextPrayer: {
    prayer: PrayerItem;
    countdownMs: number;
  } | null;
}

export function NextPrayerCard({ nextPrayer }: NextPrayerCardProps) {
  if (!nextPrayer) {
    return (
      <div className="mx-5 my-3 p-6 glass-card animate-pulse flex flex-col items-center justify-center space-y-3 min-h-[190px]">
        <div className="h-4 w-24 bg-white/10 rounded-full"></div>
        <div className="h-8 w-32 bg-white/10 rounded-lg"></div>
        <div className="h-10 w-44 bg-white/10 rounded-xl"></div>
      </div>
    );
  }

  const { prayer, countdownMs } = nextPrayer;

  return (
    <div className="mx-5 my-3 relative overflow-hidden glass-card-gold p-6 transition-all">
      {/* Background Soft Glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-semibold tracking-wider text-amber-200/80 uppercase">
            Next Prayer
          </span>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-medium border border-amber-400/20">
          {prayer.time}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">{prayer.name}</h2>
          <p className="text-2xl font-serif text-amber-300/80 mt-0.5 tracking-wide" dir="rtl">
            {prayer.arabicName}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase font-medium tracking-widest text-zinc-400 mb-0.5">
            Starts In
          </p>
          <div className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 tracking-wider drop-shadow-sm">
            {formatCountdown(countdownMs)}
          </div>
        </div>
      </div>
    </div>
  );
}
