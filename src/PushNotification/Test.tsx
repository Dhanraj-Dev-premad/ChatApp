import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
} from '@notifee/react-native';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import {
  getMessaging,
  getToken,
  onMessage,
  requestPermission,
  setBackgroundMessageHandler,
  subscribeToTopic,
  unsubscribeFromTopic,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { notificationsApi } from '../api/notifications';
import {
  check,
  request,
  RESULTS,
} from 'react-native-permissions';
import { navigate } from '../utils/navigationUtils';
import { ROUTES } from '../utils/constants';

// Get Firebase Messaging instance for v26+ Modular API
const messagingInstance = getMessaging();

// Register background message handler as early as possible
setBackgroundMessageHandler(messagingInstance, async  => {
  console.log('📩 [FCM Background] Message handled:', );
});

// Helper to remove HTML tags from notification body
const stripHtmlTags = (html?: string): string =>
  html
    ? html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()
    : '';

let unsubscribeForegroundMessage: any = null;
let unsubscribeForegroundEvent: any = null;

/**
 * Retrieves the device FCM token using Firebase v26+ Modular API (`getToken`)
 * and automatically syncs it to the backend `PUT /users/me/fcm-token`.
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    const token = await getToken(messagingInstance);
    console.log('🔑 FCM Token:', token);
    if (token) {
      notificationsApi.saveFcmToken(token).catch(err => {
        console.log('[FCM] Token sync silent log:', err?.message || err);
      });
    }
    return token;
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
}

/**
 * Subscribes the device to broadcasts intended for every app user.
 */
async function subscribeToAllUsersTopic(): Promise<void> {
  try {
    await subscribeToTopic(messagingInstance, 'all_users');
    console.log('📣 Subscribed to FCM topic: all_users');
  } catch (error) {
    console.error('❌ Error subscribing to FCM topic all_users:', error);
  }
}

export async function unsubscribeFromAllUsersTopic(): Promise<void> {
  try {
    await unsubscribeFromTopic(messagingInstance, 'all_users');
    console.log('📣 Unsubscribed from FCM topic: all_users');
  } catch (error) {
    console.error('❌ Error unsubscribing from FCM topic all_users:', error);
  }
}

/**
 * Handles notification permission requests cleanly across platforms:
 * - On Android 33+ (API level 33+), requests POST_NOTIFICATIONS via react-native-permissions.
 * - On iOS / general, uses modular requestPermission & Notifee.
 */
async function requestNotificationPermission(): Promise<boolean> {
  try {
    // Android 13+ (API 33+) explicit permission request
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const permission = (PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS as any);
      const currentStatus = await check(permission);

      console.log('📜 Android POST_NOTIFICATIONS Current Status:', currentStatus);

      if (currentStatus === RESULTS.GRANTED) {
        return true;
      }

      if (currentStatus === RESULTS.DENIED) {
        const result = await request(permission);
        console.log('📜 Android POST_NOTIFICATIONS Requested Result:', result);
        return result === RESULTS.GRANTED;
      }

      if (currentStatus === RESULTS.BLOCKED) {
        console.log('❌ Android POST_NOTIFICATIONS permission blocked in device settings');
        return false;
      }
    }

    // iOS / General FCM Permission request
    const authStatus = await requestPermission(messagingInstance);
    console.log('📜 FCM Permission Status:', authStatus);

    const notifeeStatus = await notifee.requestPermission();
    console.log('📜 Notifee Permission Status:', notifeeStatus);

    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Initializes foreground notification listeners using Firebase v26+ `onMessage` modular API
 * and Notifee for local banner displays.
 */
async function initializeNotificationListeners(): Promise<void> {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'default',
  });

  // Foreground FCM message listener
  unsubscribeForegroundMessage = onMessage(messagingInstance, async  => {
    console.log('📩 Foreground FCM:', );

    const { title, body, image } = (.data as any) || {};
    const displayTitle = (title as string) || .notification?.title || 'Notification';
    const rawBody = (body as string) || .notification?.body || '';
    const cleanBody = stripHtmlTags(rawBody);

    await notifee.displayNotification({
      title: displayTitle,
      body: cleanBody,
      data: ?.data || {},

      android: {
        channelId,
        smallIcon: 'ic_launcher',

        ...(image && {
          style: {
            type: AndroidStyle.BIGPICTURE,
            picture: image as string,
          },
        }),
      },

      ios: {
        attachments: image ? [{ url: image as string }] : [],
      },
    });
  });

  // Foreground click / dismiss event listener
  unsubscribeForegroundEvent = notifee.onForegroundEvent(
    async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        const { notification } = detail;
        const deeplink = notification?.data?.deeplink as string;

        console.log('🔗 Deep link from notification:', deeplink);

        if (notification?.id) {
          await notifee.cancelNotification(notification.id);
        }

        if (notification?.data?.type === 'ai_chat') {
          navigate(ROUTES.AI_CHAT);
          return;
        }

        if (deeplink) {
          Linking.openURL(deeplink);
        }
      }
    }
  );
}

/**
 * Cleans up FCM and Notifee notification listeners.
 */
export function cleanupNotificationListeners(): void {
  if (unsubscribeForegroundMessage) {
    unsubscribeForegroundMessage();
    unsubscribeForegroundMessage = null;
  }

  if (unsubscribeForegroundEvent) {
    unsubscribeForegroundEvent();
    unsubscribeForegroundEvent = null;
  }
}

/**
 * Setup entrypoint for application startup.
 */
export default async function setupNotifications(): Promise<void> {
  const permissionGranted = await requestNotificationPermission();

  console.log('🔔 Notification Permission Granted:', permissionGranted);

  if (permissionGranted) {
    await initializeNotificationListeners();
    await getFCMToken();
    await subscribeToAllUsersTopic();
  } else {
    console.warn('⚠️ Notification permission not granted.');
  }
}













