import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentMethod, PaymentType, Order } from '@/types';

interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  currency?: string;
  description?: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  error?: string;
}

interface MobileMoneyRequest {
  phoneNumber: string;
  provider: 'orange' | 'mtn' | 'moov' | 'wave';
  amount: number;
  orderId: string;
}

interface CardPaymentRequest {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  holderName: string;
  amount: number;
  orderId: string;
}

class PaymentService {
  private readonly STORAGE_KEY = 'foodza_payment_methods';
  private readonly TRANSACTION_KEY = 'foodza_transactions';

  /**
   * Get saved payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('PaymentService.getPaymentMethods error:', error);
      return [];
    }
  }

  /**
   * Add new payment method
   */
  async addPaymentMethod(paymentMethod: PaymentMethod): Promise<{ success: boolean; error?: string }> {
    try {
      const methods = await this.getPaymentMethods();
      
      // Check if method already exists
      const exists = methods.some(method => method.id === paymentMethod.id);
      if (exists) {
        return { success: false, error: 'Payment method already exists' };
      }

      // Set as default if it's the first one
      if (methods.length === 0) {
        paymentMethod.isDefault = true;
      }

      methods.push(paymentMethod);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(methods));
      
      return { success: true };
    } catch (error) {
      console.error('PaymentService.addPaymentMethod error:', error);
      return { success: false, error: 'Failed to save payment method' };
    }
  }

  /**
   * Update payment method
   */
  async updatePaymentMethod(methodId: string, updates: Partial<PaymentMethod>): Promise<{ success: boolean; error?: string }> {
    try {
      const methods = await this.getPaymentMethods();
      const index = methods.findIndex(method => method.id === methodId);
      
      if (index === -1) {
        return { success: false, error: 'Payment method not found' };
      }

      // Handle default payment method logic
      if (updates.isDefault) {
        methods.forEach(method => method.isDefault = false);
      }

      methods[index] = { ...methods[index], ...updates };
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(methods));
      
      return { success: true };
    } catch (error) {
      console.error('PaymentService.updatePaymentMethod error:', error);
      return { success: false, error: 'Failed to update payment method' };
    }
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(methodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const methods = await this.getPaymentMethods();
      const filteredMethods = methods.filter(method => method.id !== methodId);
      
      if (filteredMethods.length === methods.length) {
        return { success: false, error: 'Payment method not found' };
      }

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredMethods));
      
      return { success: true };
    } catch (error) {
      console.error('PaymentService.deletePaymentMethod error:', error);
      return { success: false, error: 'Failed to delete payment method' };
    }
  }

  /**
   * Get default payment method
   */
  async getDefaultPaymentMethod(): Promise<PaymentMethod | null> {
    try {
      const methods = await this.getPaymentMethods();
      return methods.find(method => method.isDefault) || null;
    } catch (error) {
      console.error('PaymentService.getDefaultPaymentMethod error:', error);
      return null;
    }
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(methodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const methods = await this.getPaymentMethods();
      const methodExists = methods.some(method => method.id === methodId);
      
      if (!methodExists) {
        return { success: false, error: 'Payment method not found' };
      }

      const updatedMethods = methods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }));

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMethods));
      
      return { success: true };
    } catch (error) {
      console.error('PaymentService.setDefaultPaymentMethod error:', error);
      return { success: false, error: 'Failed to set default payment method' };
    }
  }

  /**
   * Process payment for an order
   */
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { paymentMethod, amount, orderId } = paymentRequest;

      switch (paymentMethod.type) {
        case 'mobile_money':
          return await this.processMobileMoneyPayment({
            phoneNumber: paymentMethod.details.mobileNumber || '',
            provider: paymentMethod.details.mobileProvider as any,
            amount,
            orderId,
          });

        case 'card':
          return await this.processCardPayment({
            cardNumber: paymentMethod.details.cardNumber || '',
            expiryDate: paymentMethod.details.expiryDate || '',
            cvv: paymentMethod.details.cvv || '',
            holderName: paymentMethod.details.holderName || '',
            amount,
            orderId,
          });

        case 'cash':
          return await this.processCashPayment(orderId, amount);

        case 'wallet':
          return await this.processWalletPayment(orderId, amount);

        default:
          return { success: false, error: 'Unsupported payment method' };
      }
    } catch (error) {
      console.error('PaymentService.processPayment error:', error);
      return { success: false, error: 'Payment processing failed' };
    }
  }

  /**
   * Process mobile money payment
   */
  private async processMobileMoneyPayment(request: MobileMoneyRequest): Promise<PaymentResponse> {
    try {
      // Simulate mobile money API call
      await this.simulateNetworkDelay(2000);

      // In production, this would integrate with actual mobile money APIs
      // Orange Money, MTN Mobile Money, Moov, Wave, etc.
      
      const transactionId = `mm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Save transaction
      await this.saveTransaction({
        id: transactionId,
        orderId: request.orderId,
        amount: request.amount,
        type: 'mobile_money',
        provider: request.provider,
        status: 'completed',
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        transactionId,
        status: 'completed',
      };
    } catch (error) {
      console.error('PaymentService.processMobileMoneyPayment error:', error);
      return { success: false, error: 'Mobile money payment failed' };
    }
  }

  /**
   * Process card payment
   */
  private async processCardPayment(request: CardPaymentRequest): Promise<PaymentResponse> {
    try {
      // Simulate card payment API call
      await this.simulateNetworkDelay(3000);

      // In production, this would integrate with payment gateways
      // Stripe, PayPal, Paystack, etc.

      const transactionId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.saveTransaction({
        id: transactionId,
        orderId: request.orderId,
        amount: request.amount,
        type: 'card',
        status: 'completed',
        createdAt: new Date().toISOString(),
        maskedCard: this.maskCardNumber(request.cardNumber),
      });

      return {
        success: true,
        transactionId,
        status: 'completed',
      };
    } catch (error) {
      console.error('PaymentService.processCardPayment error:', error);
      return { success: false, error: 'Card payment failed' };
    }
  }

  /**
   * Process cash payment
   */
  private async processCashPayment(orderId: string, amount: number): Promise<PaymentResponse> {
    try {
      const transactionId = `cash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.saveTransaction({
        id: transactionId,
        orderId,
        amount,
        type: 'cash',
        status: 'pending', // Cash payments are pending until delivery
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        transactionId,
        status: 'pending',
      };
    } catch (error) {
      console.error('PaymentService.processCashPayment error:', error);
      return { success: false, error: 'Cash payment processing failed' };
    }
  }

  /**
   * Process wallet payment
   */
  private async processWalletPayment(orderId: string, amount: number): Promise<PaymentResponse> {
    try {
      // Simulate wallet payment API call
      await this.simulateNetworkDelay(1500);

      const transactionId = `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.saveTransaction({
        id: transactionId,
        orderId,
        amount,
        type: 'wallet',
        status: 'completed',
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        transactionId,
        status: 'completed',
      };
    } catch (error) {
      console.error('PaymentService.processWalletPayment error:', error);
      return { success: false, error: 'Wallet payment failed' };
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(): Promise<any[]> {
    try {
      const stored = await AsyncStorage.getItem(this.TRANSACTION_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('PaymentService.getPaymentHistory error:', error);
      return [];
    }
  }

  /**
   * Save transaction record
   */
  private async saveTransaction(transaction: any): Promise<void> {
    try {
      const transactions = await this.getPaymentHistory();
      transactions.push(transaction);
      await AsyncStorage.setItem(this.TRANSACTION_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('PaymentService.saveTransaction error:', error);
    }
  }

  /**
   * Mask card number for display
   */
  private maskCardNumber(cardNumber: string): string {
    if (!cardNumber || cardNumber.length < 4) return '****';
    return `****-****-****-${cardNumber.slice(-4)}`;
  }

  /**
   * Simulate network delay for demo purposes
   */
  private simulateNetworkDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate payment method
   */
  validatePaymentMethod(paymentMethod: PaymentMethod): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!paymentMethod.id || !paymentMethod.type) {
      errors.push('Payment method ID and type are required');
    }

    switch (paymentMethod.type) {
      case 'mobile_money':
        if (!paymentMethod.details.mobileNumber) {
          errors.push('Mobile number is required');
        }
        if (!paymentMethod.details.mobileProvider) {
          errors.push('Mobile provider is required');
        }
        break;

      case 'card':
        if (!paymentMethod.details.cardNumber) {
          errors.push('Card number is required');
        }
        if (!paymentMethod.details.expiryDate) {
          errors.push('Expiry date is required');
        }
        if (!paymentMethod.details.cvv) {
          errors.push('CVV is required');
        }
        if (!paymentMethod.details.holderName) {
          errors.push('Cardholder name is required');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
const paymentService = new PaymentService();
export default paymentService;

// Export the class for static method access
export { PaymentService };
