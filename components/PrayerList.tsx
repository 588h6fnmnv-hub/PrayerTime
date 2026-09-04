'use client';

import { NotificationPreferences, PrayerItem, PrayerName } from '@/types';
import { Bell, BellOff } from 'lucide-react';

interface PrayerListProps {
  prayers: PrayerItem[];
  nextPrayerName?: PrayerName;
  notificationPreferences: NotificationPreferences;
  onToggleNotification: (prayerName: PrayerName) => void;
}

export function PrayerList({
  prayers,
  nextPrayerName,
  notificationPreferences,
  onToggleNotification,
}: PrayerListProps) {
  return (
    <div className="mx-5 my-3 space-y-2.5">
      <div className="px-1 flex justify-between items-center text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
        <span>Today&apos;s Schedule</span>
        <span>Notification</span>
      </div>

      <div className="space-y-2">
        {prayers.map((prayer) => {
          const isNext = prayer.id === nextPrayerName;
          const isNotifOn = notificationPreferences[prayer.id];

          return (
            <div
              key={prayer.id}
              className={`p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                isNext
                  ? 'glass-card border-amber-500/30 bg-amber-500/[0.07] shadow-lg shadow-amber-500/5'
                  : 'glass-card hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isNext ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]' : 'bg-zinc-600'
                  }`}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-semibold tracking-wide ${
                        isNext ? 'text-amber-200' : 'text-zinc-100'
                      }`}
                    >
                      {prayer.name}
                    </span>
                    <span className="text-xs text-zinc-500 font-serif">{prayer.arabicName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span
                  className={`text-sm font-medium font-mono ${
                    isNext ? 'text-amber-300 font-bold' : 'text-zinc-300'
                  }`}
                >
                  {prayer.time}
                </span>

                <button
                  onClick={() => onToggleNotification(prayer.id)}
                  aria-label={`Toggle notification for ${prayer.name}`}
                  className={`p-2 rounded-xl transition-all ${
                    isNotifOn
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                      : 'bg-zinc-800/40 text-zinc-500 border border-white/5 hover:text-zinc-300'
                  }`}
                >
                  {isNotifOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
