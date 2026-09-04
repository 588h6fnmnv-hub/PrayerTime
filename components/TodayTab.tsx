'use client';

import { DateInfo, NotificationPreferences, PrayerData, PrayerName } from '@/types';
import { NextPrayerCard } from './NextPrayerCard';
import { PrayerList } from './PrayerList';
import { Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface TodayTabProps {
  prayerData: PrayerData | null;
  notificationPreferences: NotificationPreferences;
  onToggleNotification: (prayerName: PrayerName) => void;
}

export function TodayTab({
  prayerData,
  notificationPreferences,
  onToggleNotification,
}: TodayTabProps) {
  if (!prayerData) return null;

  const dateInfo: DateInfo = prayerData.dateInfo;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Date Header Pill */}
      <div className="mx-5 glass-pill p-3 px-4 flex items-center justify-between border border-white/10 shadow-sm">
        <div className="flex items-center space-x-2.5">
          <CalendarIcon className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-zinc-200">{dateInfo.gregorian.date}</span>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-amber-300/90 font-serif">
          <Sparkles className="w-3 h-3 text-amber-400/80" />
          <span>{dateInfo.hijri.date}</span>
        </div>
      </div>

      {/* Main Hero Card: Next Prayer */}
      <NextPrayerCard nextPrayer={prayerData.nextPrayer} />

      {/* Today Prayer Times List */}
      <PrayerList
        prayers={prayerData.prayers}
        nextPrayerName={prayerData.nextPrayer?.prayer.id}
        notificationPreferences={notificationPreferences}
        onToggleNotification={onToggleNotification}
      />
    </div>
  );
}
