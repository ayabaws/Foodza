import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, Restaurant } from '@/types';

interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: 'order' | 'promotion' | 'restaurant' | 'system';
  data?: any;
  read: boolean;
  createdAt: string;
  scheduledFor?: string;
}

interface NotificationSettings {
  enabled: boolean;
  promotions: boolean;
  orders: boolean;
  reviews: boolean;
  newRestaurants: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;   // HH:mm format
  };
}

interface PushNotificationToken {
  token: string;
  platform: 'ios' | 'android';
  updatedAt: string;
}

class NotificationService {
  private readonly NOTIFICATIONS_KEY = 'foodza_notifications';
  private readonly SETTINGS_KEY = 'foodza_notification_settings';
  private readonly TOKEN_KEY = 'foodza_push_token';
  private pushToken: string | null = null;

  constructor() {
    this.initializeNotifications();
  }

  /**
   * Initialize notification service
   */
  private async initializeNotifications(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(this.TOKEN_KEY);
      if (token) {
        this.pushToken = token;
      }

      // In a real React Native app, you would initialize push notifications here
      // using expo-notifications or react-native-push-notification
      console.log('NotificationService initialized');
    } catch (error) {
      console.error('NotificationService initialization error:', error);
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<{ granted: boolean; error?: string }> {
    try {
      // In a real app, you would request actual permissions
      // For demo purposes, we'll return granted
      return { granted: true };
    } catch (error) {
      console.error('NotificationService.requestPermissions error:', error);
      return { granted: false, error: 'Failed to request notification permissions' };
    }
  }

  /**
   * Set push notification token
   */
  async setPushToken(token: string, platform: 'ios' | 'android'): Promise<{ success: boolean; error?: string }> {
    try {
      this.pushToken = token;
      
      const tokenData: PushNotificationToken = {
        token,
        platform,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
      
      // In production, you would send this token to your backend
      console.log('Push token set:', token);
      
      return { success: true };
    } catch (error) {
      console.error('NotificationService.setPushToken error:', error);
      return { success: false, error: 'Failed to set push token' };
    }
  }

  /**
   * Get notification settings
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const stored = await AsyncStorage.getItem(this.SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }

      // Default settings
      const defaultSettings: NotificationSettings = {
        enabled: true,
        promotions: true,
        orders: true,
        reviews: true,
        newRestaurants: true,
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00',
        },
      };

      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    } catch (error) {
      console.error('NotificationService.getNotificationSettings error:', error);
      return {
        enabled: true,
        promotions: true,
        orders: true,
        reviews: true,
        newRestaurants: true,
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00',
        },
      };
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<{ success: boolean; error?: string }> {
    try {
      const currentSettings = await this.getNotificationSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updatedSettings));
      
      return { success: true };
    } catch (error) {
      console.error('NotificationService.updateNotificationSettings error:', error);
      return { success: false, error: 'Failed to update notification settings' };
    }
  }

  /**
   * Send local notification
   */
  async sendLocalNotification(notification: Omit<NotificationData, 'id' | 'createdAt' | 'read'>): Promise<{ success: boolean; error?: string }> {
    try {
      const settings = await this.getNotificationSettings();
      
      // Check if notifications are enabled
      if (!settings.enabled) {
        return { success: false, error: 'Notifications are disabled' };
      }

      // Check quiet hours
      if (settings.quietHours.enabled && this.isInQuietHours(settings.quietHours)) {
        return { success: false, error: 'Quiet hours active' };
      }

      // Check type-specific settings
      if (!this.shouldSendNotification(notification.type, settings)) {
        return { success: false, error: 'Notification type disabled' };
      }

      const notificationData: NotificationData = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        read: false,
        createdAt: new Date().toISOString(),
      };

      // Save notification
      await this.saveNotification(notificationData);

      // In a real app, you would trigger a local notification here
      console.log('Local notification sent:', notificationData);

      return { success: true };
    } catch (error) {
      console.error('NotificationService.sendLocalNotification error:', error);
      return { success: false, error: 'Failed to send notification' };
    }
  }

  /**
   * Send order status notification
   */
  async sendOrderStatusNotification(order: Order): Promise<{ success: boolean; error?: string }> {
    const statusMessages = {
      'confirmed': 'Votre commande a été confirmée',
      'preparing': 'Votre commande est en préparation',
      'ready': 'Votre commande est prête',
      'on_the_way': 'Votre commande est en cours de livraison',
      'delivered': 'Votre commande a été livrée',
      'cancelled': 'Votre commande a été annulée',
    };

    const message = statusMessages[order.status as keyof typeof statusMessages] || 'Statut de votre commande mis à jour';

    return await this.sendLocalNotification({
      title: 'Mise à jour de commande',
      body: message,
      type: 'order',
      data: {
        orderId: order.id,
        status: order.status,
        restaurantName: order.restaurantName,
      },
    });
  }

  /**
   * Send promotion notification
   */
  async sendPromotionNotification(title: string, body: string, data?: any): Promise<{ success: boolean; error?: string }> {
    return await this.sendLocalNotification({
      title,
      body,
      type: 'promotion',
      data,
    });
  }

  /**
   * Send new restaurant notification
   */
  async sendNewRestaurantNotification(restaurant: Restaurant): Promise<{ success: boolean; error?: string }> {
    return await this.sendLocalNotification({
      title: 'Nouveau restaurant disponible!',
      body: `${restaurant.name} est maintenant disponible sur Foodza`,
      type: 'restaurant',
      data: {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      },
    });
  }

  /**
   * Get notifications
   */
  async getNotifications(limit = 50, offset = 0): Promise<NotificationData[]> {
    try {
      const stored = await AsyncStorage.getItem(this.NOTIFICATIONS_KEY);
      if (!stored) return [];

      const notifications: NotificationData[] = JSON.parse(stored);
      
      // Sort by creation date (newest first)
      notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Apply pagination
      return notifications.slice(offset, offset + limit);
    } catch (error) {
      console.error('NotificationService.getNotifications error:', error);
      return [];
    }
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter(notif => !notif.read).length;
    } catch (error) {
      console.error('NotificationService.getUnreadCount error:', error);
      return 0;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const notifications = await this.getNotifications();
      const notification = notifications.find(notif => notif.id === notificationId);
      
      if (!notification) {
        return { success: false, error: 'Notification not found' };
      }

      notification.read = true;
      await AsyncStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
      
      return { success: true };
    } catch (error) {
      console.error('NotificationService.markAsRead error:', error);
      return { success: false, error: 'Failed to mark notification as read' };
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ success: boolean; error?: string }> {
    try {
      const notifications = await this.getNotifications();
      notifications.forEach(notif => notif.read = true);
      
      await AsyncStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
      
      return { success: true };
    } catch (error) {
      console.error('NotificationService.markAllAsRead error:', error);
      return { success: false, error: 'Failed to mark all notifications as read' };
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const notifications = await this.getNotifications();
      const filteredNotifications = notifications.filter(notif => notif.id !== notificationId);
      
      if (filteredNotifications.length === notifications.length) {
        return { success: false, error: 'Notification not found' };
      }

      await AsyncStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(filteredNotifications));
      
      return { success: true };
    } catch (error) {
      console.error('NotificationService.deleteNotification error:', error);
      return { success: false, error: 'Failed to delete notification' };
    }
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<{ success: boolean; error?: string }> {
    try {
      await AsyncStorage.removeItem(this.NOTIFICATIONS_KEY);
      return { success: true };
    } catch (error) {
      console.error('NotificationService.clearAllNotifications error:', error);
      return { success: false, error: 'Failed to clear notifications' };
    }
  }

  /**
   * Schedule notification
   */
  async scheduleNotification(notification: Omit<NotificationData, 'id' | 'createdAt' | 'read'>, scheduledFor: string): Promise<{ success: boolean; error?: string }> {
    try {
      const notificationData: NotificationData = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        read: false,
        createdAt: new Date().toISOString(),
        scheduledFor,
      };

      // Save notification
      await this.saveNotification(notificationData);

      // In a real app, you would schedule the notification using the platform's scheduling system
      console.log('Notification scheduled for:', scheduledFor);

      return { success: true };
    } catch (error) {
      console.error('NotificationService.scheduleNotification error:', error);
      return { success: false, error: 'Failed to schedule notification' };
    }
  }

  /**
   * Save notification to storage
   */
  private async saveNotification(notification: NotificationData): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      notifications.unshift(notification); // Add to beginning
      
      // Keep only last 100 notifications
      if (notifications.length > 100) {
        notifications.splice(100);
      }
      
      await AsyncStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('NotificationService.saveNotification error:', error);
    }
  }

  /**
   * Check if notification should be sent based on type and settings
   */
  private shouldSendNotification(type: string, settings: NotificationSettings): boolean {
    switch (type) {
      case 'promotion':
        return settings.promotions;
      case 'order':
        return settings.orders;
      case 'restaurant':
        return settings.newRestaurants;
      default:
        return true;
    }
  }

  /**
   * Check if current time is within quiet hours
   */
  private isInQuietHours(quietHours: { start: string; end: string }): boolean {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return currentTime >= quietHours.start || currentTime <= quietHours.end;
  }

  /**
   * Get push token
   */
  getPushToken(): string | null {
    return this.pushToken;
  }

  /**
   * Clear push token
   */
  async clearPushToken(): Promise<void> {
    this.pushToken = null;
    await AsyncStorage.removeItem(this.TOKEN_KEY);
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;

// Export the class for static method access
export { NotificationService };
