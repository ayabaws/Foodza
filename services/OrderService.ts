import { Order } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { orderApi } from './api';

class OrderService {
  private storageKey = 'foodza_orders';

  /**
   * Save a new order (local storage fallback)
   */
  async saveOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      // Essayer d'abord l'API
      const response = await orderApi.createOrder(orderData);
      
      if (response.success && response.data) {
        // Sauvegarder aussi en local comme backup
        await this.saveOrderLocally(response.data);
        return response.data;
      }
      
      throw new Error(response.error?.message || 'Failed to save order');
    } catch (error) {
      console.warn('API indisponible, sauvegarde locale:', error);
      
      // Fallback: sauvegarder localement
      const order: Order = {
        id: `order_${Date.now()}`,
        userId: 'user_temp',
        restaurantId: orderData.restaurantId || 'temp_restaurant',
        restaurantName: orderData.restaurantName || 'Restaurant',
        restaurantImage: orderData.restaurantImage || '',
        items: orderData.items || [],
        status: 'en-cours',
        totalAmount: orderData.totalAmount || (orderData as any).total || 0,
        deliveryFee: 0,
        tax: 0,
        deliveryAddress: orderData.deliveryAddress || {
          id: 'default',
          street: 'Adresse par défaut',
          city: 'Bamako',
          postalCode: '1234',
          country: 'Mali',
          isDefault: true
        },
        paymentMethod: orderData.paymentMethod || {
          id: 'orange_money',
          type: 'mobile_money',
          isDefault: true,
          details: {
            mobileProvider: 'Orange',
            mobileNumber: '+223XXXXXXXXX'
          }
        },
        estimatedDeliveryTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        estimatedTime: orderData.estimatedTime || '30-40 mins'
      };

      await this.saveOrderLocally(order);
      return order;
    }
  }

  /**
   * Save order locally
   */
  private async saveOrderLocally(order: Order): Promise<void> {
    try {
      const existingOrders = await this.getOrdersLocally();
      existingOrders.push(order);
      
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(existingOrders));
      console.log('Commande sauvegardée localement:', order.id);
    } catch (error) {
      console.error('Erreur sauvegarde locale:', error);
    }
  }

  /**
   * Get orders locally
   */
  private async getOrdersLocally(): Promise<Order[]> {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lecture locale:', error);
      return [];
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const response = await orderApi.getOrderById(id);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('OrderService.getOrderById error:', error);
      return null;
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string, page = 1, limit = 10): Promise<Order[]> {
    try {
      const response = await orderApi.getUserOrders(userId, page, limit);
      
      if (response.success && response.data) {
        return response.data.items;
      }
      
      return [];
    } catch (error) {
      console.error('OrderService.getUserOrders error:', error);
      return [];
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: string): Promise<Order | null> {
    try {
      const response = await orderApi.updateOrderStatus(id, status);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('OrderService.updateOrderStatus error:', error);
      return null;
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: string, reason?: string): Promise<Order | null> {
    try {
      const response = await orderApi.cancelOrder(id, reason);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('OrderService.cancelOrder error:', error);
      return null;
    }
  }

  /**
   * Track order
   */
  async trackOrder(id: string): Promise<any | null> {
    try {
      const response = await orderApi.trackOrder(id);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('OrderService.trackOrder error:', error);
      return null;
    }
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number): string {
    return `${amount.toFixed(2)} €`;
  }
}

// Export singleton instance
const orderService = new OrderService();
export default orderService;

// Export the class for static method access
export { OrderService };

