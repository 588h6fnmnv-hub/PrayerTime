import { CalculationSettings, LocationState, NotificationPreferences, PrayerData } from '@/types';

const STORAGE_KEYS = {
  LOCATION: 'kahaba_location_v1',
  SETTINGS: 'kahaba_settings_v1',
  NOTIFICATIONS: 'kahaba_notifications_v1',
  PRAYER_CACHE: 'kahaba_prayer_cache_v1',
};

// Default Fallback Settings
export const DEFAULT_LOCATION: LocationState = {
  latitude: 21.4225, // Mecca default fallback
  longitude: 39.8262,
  city: 'Makkah',
  country: 'Saudi Arabia',
  isCustom: false,
  permissionGranted: false,
};

export const DEFAULT_SETTINGS: CalculationSettings = {
  method: 4, // Umm Al-Qura Method default or 3 MWL
  school: 0, // Shafi / Standard
};

export const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  Fajr: true,
  Dhuhr: true,
  Asr: true,
  Maghrib: true,
  Isha: true,
};

// Storage Helpers
export function loadLocation(): LocationState {
  if (typeof window === 'undefined') return DEFAULT_LOCATION;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.LOCATION);
    return item ? JSON.parse(item) : DEFAULT_LOCATION;
  } catch (e) {
    console.error('Failed to load location from storage', e);
    return DEFAULT_LOCATION;
  }
}

export function saveLocation(location: LocationState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(location));
  } catch (e) {
    console.error('Failed to save location to storage', e);
  }
}

export function loadSettings(): CalculationSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return item ? JSON.parse(item) : DEFAULT_SETTINGS;
  } catch (e) {
    console.error('Failed to load settings from storage', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: CalculationSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to storage', e);
  }
}

export function loadNotifications(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return item ? { ...DEFAULT_NOTIFICATIONS, ...JSON.parse(item) } : DEFAULT_NOTIFICATIONS;
  } catch (e) {
    console.error('Failed to load notifications from storage', e);
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: NotificationPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications to storage', e);
  }
}

export function loadCachedPrayerData(): PrayerData | null {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.PRAYER_CACHE);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error('Failed to load cached prayer data', e);
    return null;
  }
}

export function saveCachedPrayerData(data: PrayerData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PRAYER_CACHE, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to cache prayer data', e);
  }
}
