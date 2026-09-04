'use client';

import { useEffect, useState, useCallback } from 'react';
import { BottomNav, TabType } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { LocationModal } from '@/components/LocationModal';
import { TodayTab } from '@/components/TodayTab';
import { PrayersTab } from '@/components/PrayersTab';
import { SettingsTab } from '@/components/SettingsTab';
import { fetchPrayerTimes, reverseGeocode } from '@/lib/api';
import { notificationManager } from '@/lib/notifications';
import {
  loadCachedPrayerData,
  loadLocation,
  loadNotifications,
  loadSettings,
  saveLocation,
  saveNotifications,
  saveSettings,
} from '@/lib/storage';
import { CalculationSettings, LocationState, NotificationPreferences, PrayerData, PrayerName } from '@/types';
import { RefreshCw, WifiOff } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [location, setLocation] = useState<LocationState>(loadLocation);
  const [settings, setSettings] = useState<CalculationSettings>(loadSettings);
  const [notifications, setNotifications] = useState<NotificationPreferences>(loadNotifications);
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Load Prayer Data
  const loadData = useCallback(
    async (loc: LocationState, setts: CalculationSettings) => {
      setLoading(true);
      const lat = loc.latitude ?? 21.4225;
      const lon = loc.longitude ?? 39.8262;

      try {
        const data = await fetchPrayerTimes(lat, lon, setts, loc.city, loc.country);
        setPrayerData(data);
        setIsOffline(false);

        // Schedule notifications if allowed
        if (data && data.prayers) {
          data.prayers.forEach((prayer) => {
            if (notifications[prayer.id] && prayer.timestamp > Date.now()) {
              notificationManager.scheduleNotification(prayer.id, prayer.time, prayer.timestamp);
            }
          });
        }
      } catch (err) {
        console.warn('API call failed, attempting to load cached prayer data', err);
        setIsOffline(true);
        const cached = loadCachedPrayerData();
        if (cached) {
          setPrayerData(cached);
        }
      } finally {
        setLoading(false);
      }
    },
    [notifications]
  );

  // Initialize on mount
  useEffect(() => {
    // Register Service Worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service Worker registration failed:', err);
      });
    }

    // Load initial data
    loadData(location, settings);

    // Initial GPS Request if not yet set
    if (!location.permissionGranted && !location.isCustom && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const geo = await reverseGeocode(lat, lon);
          const newLoc: LocationState = {
            latitude: lat,
            longitude: lon,
            city: geo.city,
            country: geo.country,
            isCustom: false,
            permissionGranted: true,
          };
          setLocation(newLoc);
          saveLocation(newLoc);
          loadData(newLoc, settings);
        },
        (err) => {
          console.warn('Geolocation permission prompt ignored or denied:', err.message);
        },
        { timeout: 8000 }
      );
    }
  }, [loadData, location, settings]);

  // Live Timer Interval (updates countdown every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setPrayerData((prevData) => {
        if (!prevData) return null;
        const nowMs = Date.now();
        let nextItem = prevData.prayers.find((p) => p.timestamp > nowMs);
        let countdownMs = 0;

        if (nextItem) {
          countdownMs = nextItem.timestamp - nowMs;
        } else {
          // Tomorrow Fajr fallback
          const fajrToday = prevData.prayers[0];
          const tomorrowFajrTimestamp = fajrToday.timestamp + 24 * 60 * 60 * 1000;
          nextItem = {
            ...fajrToday,
            timestamp: tomorrowFajrTimestamp,
          };
          countdownMs = tomorrowFajrTimestamp - nowMs;
        }

        return {
          ...prevData,
          nextPrayer: {
            prayer: nextItem,
            countdownMs,
          },
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Request GPS Location manually
  const handleRequestGPS = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const geo = await reverseGeocode(lat, lon);
          const newLoc: LocationState = {
            latitude: lat,
            longitude: lon,
            city: geo.city,
            country: geo.country,
            isCustom: false,
            permissionGranted: true,
          };
          setLocation(newLoc);
          saveLocation(newLoc);
          loadData(newLoc, settings);
        },
        (err) => {
          console.error('GPS error:', err);
          alert('Unable to retrieve location. Please search and select city manually.');
        }
      );
    }
  };

  // Select Custom City
  const handleSelectCustomLocation = async (cityName: string) => {
    try {
      // Nominatim search for city coordinates
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lon = parseFloat(results[0].lon);
          const newLoc: LocationState = {
            latitude: lat,
            longitude: lon,
            city: results[0].display_name.split(',')[0],
            country: results[0].display_name.split(',').pop()?.trim() || '',
            isCustom: true,
            permissionGranted: false,
          };
          setLocation(newLoc);
          saveLocation(newLoc);
          loadData(newLoc, settings);
          return;
        }
      }
    } catch (e) {
      console.warn('City lookup error:', e);
    }

    // Fallback: Set city name with default coordinates
    const fallbackLoc: LocationState = {
      ...location,
      city: cityName,
      isCustom: true,
    };
    setLocation(fallbackLoc);
    saveLocation(fallbackLoc);
    loadData(fallbackLoc, settings);
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: CalculationSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    loadData(location, newSettings);
  };

  // Toggle Notifications
  const handleToggleNotification = async (prayerName: PrayerName) => {
    const isEnabling = !notifications[prayerName];

    if (isEnabling) {
      const granted = await notificationManager.requestPermission();
      if (!granted) {
        alert('Notification permissions are blocked in your browser settings.');
      }
    }

    const updated = {
      ...notifications,
      [prayerName]: !notifications[prayerName],
    };
    setNotifications(updated);
    saveNotifications(updated);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between relative bg-[#050505]">
      {/* App Top Header */}
      <Header
        cityName={location.city}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />

      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="mx-5 my-2 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Using cached prayer offline data.</span>
          </div>
          <button
            onClick={() => loadData(location, settings)}
            className="p-1 rounded-lg bg-amber-400/20 text-amber-200 hover:bg-amber-400/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Content Body Based on Selected Tab */}
      <div className="flex-1 pb-8 pt-1">
        {loading && !prayerData ? (
          <div className="mx-5 my-12 p-8 glass-card flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <p className="text-xs text-zinc-400 font-medium tracking-wide">
              Calculating precise prayer times...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'today' && (
              <TodayTab
                prayerData={prayerData}
                notificationPreferences={notifications}
                onToggleNotification={handleToggleNotification}
              />
            )}

            {activeTab === 'prayers' && (
              <PrayersTab
                prayerData={prayerData}
                notificationPreferences={notifications}
                onToggleNotification={handleToggleNotification}
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                cityName={location.city}
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
                notificationPreferences={notifications}
                onToggleNotification={handleToggleNotification}
              />
            )}
          </>
        )}
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onRequestGPS={handleRequestGPS}
        onSelectCustomLocation={handleSelectCustomLocation}
        currentCity={location.city}
      />

      {/* Floating Glass Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}
