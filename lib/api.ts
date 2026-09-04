import { AlAdhanApiResponse, CalculationSettings, DateInfo, PrayerData, PrayerItem, PrayerName } from '@/types';
import { saveCachedPrayerData } from './storage';

export const PRAYER_ARABIC_NAMES: Record<PrayerName, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

export const CALCULATION_METHODS = [
  { id: 3, name: 'Muslim World League' },
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 5, name: 'Egyptian General Authority of Survey' },
  { id: 4, name: 'Umm Al-Qura University, Makkah' },
  { id: 1, name: 'University of Islamic Sciences, Karachi' },
  { id: 7, name: 'Institute of Geophysics, University of Tehran' },
  { id: 8, name: 'Gulf Region' },
  { id: 12, name: 'Union Des Organisations Islamiques De France' },
  { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey' },
];

export const MADHABS = [
  { id: 0, name: 'Shafi / Standard (Maliki, Hanbali, Shafi)' },
  { id: 1, name: 'Hanafi' },
];

// Helper to format time into 12h AM/PM
export function formatTime12h(time24: string): string {
  const cleanTime = time24.split(' ')[0]; // remove any extra text like (EST)
  const [hoursStr, minutesStr] = cleanTime.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (isNaN(hours) || isNaN(minutes)) return time24;

  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const minFormatted = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minFormatted} ${period}`;
}

// Format countdown remaining ms to HH:MM:SS
export function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// Reverse geocoding to get city name from lat/long using free OpenStreetMap Nominatim
export async function reverseGeocode(latitude: number, longitude: number): Promise<{ city: string; country: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.state_district ||
      data.address?.state ||
      'Detected Location';
    const country = data.address?.country || '';
    return { city, country };
  } catch (e) {
    console.warn('Reverse geocoding error:', e);
    return { city: 'Current Location', country: '' };
  }
}

// Fetch prayer times from AlAdhan API
export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  settings: CalculationSettings,
  city: string,
  country: string
): Promise<PrayerData> {
  const dateObj = new Date();
  const dateStr = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${settings.method}&school=${settings.school}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`AlAdhan API error: ${response.status}`);
  }

  const result: AlAdhanApiResponse = await response.json();
  const data = result.data;
  const timings = data.timings;

  const prayerKeys: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const now = new Date();
  const todayDatePrefix = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
    .getDate()
    .toString()
    .padStart(2, '0')}`;

  const prayers: PrayerItem[] = prayerKeys.map((key) => {
    const rawTime = timings[key].split(' ')[0];
    const [h, m] = rawTime.split(':');
    const pDate = new Date(`${todayDatePrefix}T${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`);

    return {
      id: key,
      name: key,
      arabicName: PRAYER_ARABIC_NAMES[key],
      time: formatTime12h(rawTime),
      rawTime,
      timestamp: pDate.getTime(),
    };
  });

  // Calculate Next Prayer
  const nowMs = now.getTime();
  let nextPrayerItem = prayers.find((p) => p.timestamp > nowMs);

  let countdownMs = 0;
  if (nextPrayerItem) {
    countdownMs = nextPrayerItem.timestamp - nowMs;
  } else {
    // If all prayers today have passed, next prayer is Fajr tomorrow
    const fajrToday = prayers[0];
    const tomorrowFajrTimestamp = fajrToday.timestamp + 24 * 60 * 60 * 1000;
    nextPrayerItem = {
      ...fajrToday,
      timestamp: tomorrowFajrTimestamp,
    };
    countdownMs = tomorrowFajrTimestamp - nowMs;
  }

  const dateInfo: DateInfo = {
    gregorian: {
      date: `${data.date.gregorian.weekday.en}, ${data.date.gregorian.date}`,
      day: data.date.gregorian.weekday.en,
      month: data.date.gregorian.month.en,
      year: data.date.gregorian.year,
    },
    hijri: {
      date: `${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year} AH`,
      day: data.date.hijri.day,
      monthEn: data.date.hijri.month.en,
      monthAr: data.date.hijri.month.ar,
      year: data.date.hijri.year,
    },
  };

  const prayerData: PrayerData = {
    prayers,
    nextPrayer: {
      prayer: nextPrayerItem,
      countdownMs,
    },
    dateInfo,
    meta: {
      latitude,
      longitude,
      city,
      country,
      method: settings.method,
      school: settings.school,
    },
  };

  // Cache latest valid data
  saveCachedPrayerData(prayerData);

  return prayerData;
}
