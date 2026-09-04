import { PrayerName } from '@/types';

/**
 * Notification abstraction interface for Kahaba.
 * Designed to seamlessly bridge Web Notifications and future Capacitor Native Local Notifications.
 */

export interface NotificationService {
  requestPermission(): Promise<boolean>;
  getPermissionState(): Promise<NotificationPermission | 'granted' | 'denied' | 'default'>;
  scheduleNotification(prayerName: PrayerName, prayerTimeStr: string, timestamp: number): Promise<void>;
  cancelAllNotifications(): Promise<void>;
  sendImmediateNotification(title: string, body: string): Promise<void>;
}

class WebNotificationService implements NotificationService {
  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async getPermissionState(): Promise<NotificationPermission | 'granted' | 'denied' | 'default'> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  async scheduleNotification(prayerName: PrayerName, prayerTimeStr: string, timestamp: number): Promise<void> {
    const perm = await this.getPermissionState();
    if (perm !== 'granted') return;

    const now = Date.now();
    const delay = timestamp - now;

    if (delay > 0) {
      // In Web PWA mode, background setTimeout is throttled by iOS Safari when suspended.
      // This is logged for local web testing, while native iOS Capacitor LocalNotifications plugin
      // will handle exact background OS alarms.
      setTimeout(() => {
        this.sendImmediateNotification(
          `Time for ${prayerName}`,
          `It is now time for ${prayerName} (${prayerTimeStr}).`
        );
      }, Math.min(delay, 2147483647)); // Cap max 32-bit int timeout
    }
  }

  async cancelAllNotifications(): Promise<void> {
    // Web notifications API does not have a scheduled queue like Capacitor LocalNotifications
  }

  async sendImmediateNotification(title: string, body: string): Promise<void> {
    const perm = await this.getPermissionState();
    if (perm !== 'granted') return;

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification(title, {
          body,
          icon: '/icons/kahaba.svg',
          badge: '/icons/kahaba.svg',
          tag: title,
        });
        return;
      } catch (e) {
        console.warn('Service worker notification failed, falling back to Notification constructor', e);
      }
    }

    new Notification(title, {
      body,
      icon: '/icons/kahaba.svg',
    });
  }
}

// Singleton notification manager
export const notificationManager: NotificationService = new WebNotificationService();
