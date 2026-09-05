'use client';

import { CALCULATION_METHODS, MADHABS } from '@/lib/api';
import { CalculationSettings, NotificationPreferences, PrayerName } from '@/types';
import {
  Bell,
  Check,
  Compass,
  Download,
  Info,
  MapPin,
  Smartphone,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SettingsTabProps {
  settings: CalculationSettings;
  onUpdateSettings: (newSettings: CalculationSettings) => void;
  cityName: string;
  onOpenLocationModal: () => void;
  notificationPreferences: NotificationPreferences;
  onToggleNotification: (prayerName: PrayerName) => void;
}

export function SettingsTab({
  settings,
  onUpdateSettings,
  cityName,
  onOpenLocationModal,
  notificationPreferences,
  onToggleNotification,
}: SettingsTabProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const prayerKeys: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <div className="mx-5 space-y-6 pb-6 animate-in fade-in duration-300">
      {/* SECTION 1: LOCATION */}
      <section className="glass-card p-5 space-y-3.5">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>Location</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5">
          <div>
            <span className="text-[11px] text-zinc-500 uppercase font-medium">Current Location</span>
            <p className="text-sm font-bold text-white mt-0.5">{cityName || 'Not Set'}</p>
          </div>
          <button
            onClick={onOpenLocationModal}
            className="glass-button px-3 py-1.5 rounded-xl text-xs text-amber-300 border border-amber-400/30 hover:bg-amber-400/10 transition-all font-medium"
          >
            Change
          </button>
        </div>
      </section>

      {/* SECTION 2: PRAYER CALCULATION */}
      <section className="glass-card p-5 space-y-4">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>Prayer Calculation</span>
        </div>

        {/* Calculation Method */}
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium block">Calculation Method</label>
          <select
            value={settings.method}
            onChange={(e) =>
              onUpdateSettings({ ...settings, method: parseInt(e.target.value, 10) })
            }
            className="w-full glass-button px-3.5 py-3 rounded-2xl text-xs text-white bg-zinc-900/90 border border-white/10 focus:outline-none focus:border-amber-400/50 appearance-none cursor-pointer"
          >
            {CALCULATION_METHODS.map((method) => (
              <option key={method.id} value={method.id} className="bg-zinc-900 text-white">
                {method.name}
              </option>
            ))}
          </select>
        </div>

        {/* Madhab / Asr */}
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium block">Asr Calculation (Madhab)</label>
          <div className="grid grid-cols-2 gap-2">
            {MADHABS.map((madhab) => {
              const isSelected = settings.school === madhab.id;
              return (
                <button
                  key={madhab.id}
                  onClick={() => onUpdateSettings({ ...settings, school: madhab.id })}
                  className={`p-3 rounded-2xl text-xs font-medium transition-all text-left flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow-sm'
                      : 'glass-button text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{madhab.name.split(' ')[0]}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: NOTIFICATIONS */}
      <section className="glass-card p-5 space-y-3.5">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
          <Bell className="w-4 h-4" />
          <span>Prayer Notifications</span>
        </div>

        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Notifications trigger at exact prayer times. Adjust preferences individually per prayer below.
        </p>

        <div className="space-y-2 pt-1">
          {prayerKeys.map((prayer) => {
            const isNotifOn = notificationPreferences[prayer];
            return (
              <div
                key={prayer}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5"
              >
                <span className="text-xs font-medium text-zinc-200">{prayer}</span>
                <button
                  onClick={() => onToggleNotification(prayer)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 border ${
                    isNotifOn
                      ? 'bg-amber-500 border-amber-400'
                      : 'bg-zinc-800 border-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isNotifOn ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: APP & CAPACITOR NATIVE READY */}
      <section className="glass-card p-5 space-y-4">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
          <Smartphone className="w-4 h-4" />
          <span>App & Native Integration</span>
        </div>

        {/* PWA Install */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Add to Home Screen (PWA)</span>
            {isInstalled ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                Installed
              </span>
            ) : deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="glass-button px-3 py-1 rounded-xl text-xs text-amber-300 border border-amber-400/30 flex items-center gap-1 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                Install
              </button>
            ) : (
              <span className="text-[10px] text-zinc-500">Use Safari Share &gt; Add to Home Screen</span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400">
            Install Kahaba on your iPhone for standalone full-screen experience.
          </p>
        </div>

        {/* Capacitor Info */}
        <div className="p-3.5 rounded-2xl bg-amber-500/[0.05] border border-amber-500/15 space-y-2">
          <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Capacitor iOS & IPA Export</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Kahaba architecture is fully decoupled for Capacitor conversion. An .ipa binary requires Apple Developer code signing via Xcode on macOS or AltStore/Sideloadly.
          </p>
          <div className="pt-1">
            <a
              href="https://capacitorjs.com/docs/ios"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-amber-300 font-medium hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Capacitor iOS Build Guide</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 5: ABOUT */}
      <section className="glass-card p-5 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>About Kahaba</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Kahaba is a privacy-first Islamic prayer companion. Completely free with no accounts, no ads, and no database tracking.
        </p>
        <div className="text-[10px] text-zinc-500 flex justify-between pt-2 border-t border-white/5 font-mono">
          <span>Version 1.0.0 (Liquid Glass)</span>
          <span>iPhone Optimized</span>
        </div>
      </section>
    </div>
  );
}
