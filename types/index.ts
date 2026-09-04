export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerItem {
  id: PrayerName;
  name: string;
  arabicName: string;
  time: string; // e.g. "05:00" or "5:00 AM"
  rawTime: string; // "05:00" 24h format for calculation
  timestamp: number; // Unix timestamp in ms
}

export interface DateInfo {
  gregorian: {
    date: string; // e.g., "Thursday, 12 Oct 2023"
    day: string;
    month: string;
    year: string;
  };
  hijri: {
    date: string; // e.g., "27 Rabi al-Awwal 1445"
    day: string;
    monthEn: string;
    monthAr: string;
    year: string;
  };
}

export interface PrayerData {
  prayers: PrayerItem[];
  nextPrayer: {
    prayer: PrayerItem;
    countdownMs: number;
  };
  dateInfo: DateInfo;
  meta: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
    method: number;
    school: number;
  };
}

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string;
  country: string;
  isCustom: boolean;
  permissionGranted: boolean;
}

export interface CalculationSettings {
  method: number; // e.g., 2 = ISNA, 3 = MWL, 4 = Umm Al-Qura, 5 = Egyptian, 1 = Karachi
  school: number; // 0 = Shafi/Standard, 1 = Hanafi
}

export type NotificationPreferences = Record<PrayerName, boolean>;

export interface AlAdhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface AlAdhanResponseData {
  timings: AlAdhanTimings;
  date: {
    readable: string;
    timestamp: string;
    gregorian: {
      date: string;
      weekday: { en: string };
      month: { en: string; number: number };
      year: string;
    };
    hijri: {
      date: string;
      day: string;
      weekday: { en: string; ar: string };
      month: { en: string; ar: string; number: number };
      year: string;
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: {
      id: number;
      name: string;
    };
    school: {
      id: number;
      name: string;
    };
  };
}

export interface AlAdhanApiResponse {
  code: number;
  status: string;
  data: AlAdhanResponseData;
}
