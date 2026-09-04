'use client';

import { DateInfo, NotificationPreferences, PrayerData, PrayerName } from '@/types';
import { Bell, BellOff, Calendar, MapPin, Moon } from 'lucide-react';

interface PrayersTabProps {
  prayerData: PrayerData | null;
  notificationPreferences: NotificationPreferences;
  onToggleNotification: (prayerName: PrayerName) => void;
  onOpenLocationModal: () => void;
}

export function PrayersTab({
  prayerData,
  notificationPreferences,
  onToggleNotification,
  onOpenLocationModal,
}: PrayersTabProps) {
  if (!prayerData) return null;

  const dateInfo: DateInfo = prayerData.dateInfo;

  return (
    <div className="mx-5 space-y-5 animate-in fade-in duration-300">
      {/* Overview Card */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">All Daily Prayers</h2>
          </div>
          <button
            onClick={onOpenLocationModal}
            className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-medium"
          >
            <MapPin className="w-3 h-3" />
            {prayerData.meta.city}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-zinc-500 font-medium uppercase text-[10px] block">Gregorian</span>
            <p className="text-zinc-200 font-semibold">{dateInfo.gregorian.date}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/10 space-y-1">
            <span className="text-amber-400/80 font-medium uppercase text-[10px] block">Hijri Date</span>
            <p className="text-amber-200 font-serif font-semibold">{dateInfo.hijri.date}</p>
          </div>
        </div>
      </div>

      {/* Expanded Detailed Prayer List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
          Detailed Prayer Times
        </h3>

        {prayerData.prayers.map((prayer) => {
          const isNotifOn = notificationPreferences[prayer.id];
          const isNext = prayer.id === prayerData.nextPrayer?.prayer.id;

          return (
            <div
              key={prayer.id}
              className={`glass-card p-4 flex items-center justify-between transition-all ${
                isNext ? 'border-amber-500/40 bg-amber-500/[0.08] shadow-lg shadow-amber-500/5' : ''
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-amber-400">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">{prayer.name}</h4>
                  <p className="text-xs text-amber-300/80 font-serif" dir="rtl">
                    {prayer.arabicName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-base font-bold font-mono text-zinc-100">{prayer.time}</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Exact Time</p>
                </div>

                <button
                  onClick={() => onToggleNotification(prayer.id)}
                  aria-label={`Toggle notification for ${prayer.name}`}
                  className={`p-2.5 rounded-xl transition-all ${
                    isNotifOn
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'glass-button text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {isNotifOn ? <Bell className="w-4.5 h-4.5" /> : <BellOff className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
