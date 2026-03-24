import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  time: string;
  status: 'en-cours' | 'livrée' | 'annulée';
  total: number;
  totalAmount: string;
  items: OrderItem[];
  estimatedTime?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  createdAt: number;
}

class OrderService {
  private static readonly ORDERS_KEY = 'user_orders';
  private static readonly CURRENT_ORDER_KEY = 'current_order';

  // Sauvegarder une nouvelle commande
  static async saveOrder(orderData: Omit<Order, 'id' | 'date' | 'time' | 'createdAt'>): Promise<Order> {
    try {
      const now = new Date();
      const orderId = this.generateOrderId();
      
      const newOrder: Order = {
        ...orderData,
        id: orderId,
        date: this.formatDate(now),
        time: this.formatTime(now),
        createdAt: now.getTime(),
      };

      // Récupérer les commandes existantes
      const existingOrders = await this.getOrders();
      
      // Ajouter la nouvelle commande au début
      const updatedOrders = [newOrder, ...existingOrders];
      
      // Sauvegarder dans AsyncStorage
      await AsyncStorage.setItem(this.ORDERS_KEY, JSON.stringify(updatedOrders));
      
      // Sauvegarder comme commande actuelle
      await AsyncStorage.setItem(this.CURRENT_ORDER_KEY, JSON.stringify(newOrder));
      
      console.log('Commande sauvegardée:', newOrder);
      return newOrder;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la commande:', error);
      throw error;
    }
  }

  // Récupérer toutes les commandes
  static async getOrders(): Promise<Order[]> {
    try {
      const ordersJson = await AsyncStorage.getItem(this.ORDERS_KEY);
      if (!ordersJson) return [];
      
      const orders = JSON.parse(ordersJson);
      return orders || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return [];
    }
  }

  // Récupérer la commande actuelle (en cours)
  static async getCurrentOrder(): Promise<Order | null> {
    try {
      const currentOrderJson = await AsyncStorage.getItem(this.CURRENT_ORDER_KEY);
      if (!currentOrderJson) return null;
      
      return JSON.parse(currentOrderJson);
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande actuelle:', error);
      return null;
    }
  }

  // Mettre à jour le statut d'une commande
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const orders = await this.getOrders();
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      
      await AsyncStorage.setItem(this.ORDERS_KEY, JSON.stringify(updatedOrders));
      
      // Si c'est la commande actuelle, la mettre à jour aussi
      const currentOrder = await this.getCurrentOrder();
      if (currentOrder && currentOrder.id === orderId) {
        const updatedCurrentOrder = { ...currentOrder, status };
        await AsyncStorage.setItem(this.CURRENT_ORDER_KEY, JSON.stringify(updatedCurrentOrder));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  }

  // Marquer une commande comme livrée
  static async markOrderAsDelivered(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'livrée');
  }

  // Annuler une commande
  static async cancelOrder(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'annulée');
  }

  // Supprimer une commande (pour l'historique)
  static async deleteOrder(orderId: string): Promise<void> {
    try {
      const orders = await this.getOrders();
      const filteredOrders = orders.filter(order => order.id !== orderId);
      
      await AsyncStorage.setItem(this.ORDERS_KEY, JSON.stringify(filteredOrders));
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      throw error;
    }
  }

  // Vider tout l'historique
  static async clearOrderHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.ORDERS_KEY);
      await AsyncStorage.removeItem(this.CURRENT_ORDER_KEY);
    } catch (error) {
      console.error('Erreur lors du vidage de l\'historique:', error);
      throw error;
    }
  }

  // Générer un ID de commande unique
  private static generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `#${timestamp.toString().slice(-6)}${random.toString().padStart(4, '0')}`;
  }

  // Formater la date
  private static formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  }

  // Formater l'heure
  private static formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleTimeString('fr-FR', options);
  }

  // Calculer le total d'une commande
  static calculateTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Formater le montant en CFA
  static formatAmount(amount: number): string {
    return `${amount} CFA`;
  }

  // Obtenir les commandes par statut
  static async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    const orders = await this.getOrders();
    return orders.filter(order => order.status === status);
  }

  // Obtenir les commandes en cours
  static async getActiveOrders(): Promise<Order[]> {
    return this.getOrdersByStatus('en-cours');
  }

  // Obtenir l'historique des commandes livrées
  static async getOrderHistory(): Promise<Order[]> {
    return this.getOrdersByStatus('livrée');
  }
}

export default OrderService;
