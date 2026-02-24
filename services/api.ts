import { 
  ApiResponse, 
  PaginatedResponse, 
  Restaurant, 
  Order, 
  User, 
  Review,
  SearchFilters,
  MenuItem
} from '@/types';

// Base API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.foodza.com/v1';
const API_TIMEOUT = 10000;

// API client class
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private authToken: string | null = null;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.authToken = token;
  }

  // Clear authentication token
  clearAuthToken() {
    this.authToken = null;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: {
              code: 'TIMEOUT',
              message: 'La requête a expiré',
            },
          };
        }
        
        return {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: error.message,
          },
        };
      }

      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'Une erreur inconnue est survenue',
        },
      };
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search, {
      method: 'GET',
    });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL, API_TIMEOUT);

// Restaurant API
export const restaurantApi = {
  // Get all restaurants with filters
  getRestaurants: async (filters?: SearchFilters): Promise<ApiResponse<PaginatedResponse<Restaurant>>> => {
    return apiClient.get<PaginatedResponse<Restaurant>>('/restaurants', filters);
  },

  // Get restaurant by ID
  getRestaurantById: async (id: string): Promise<ApiResponse<Restaurant>> => {
    return apiClient.get<Restaurant>(`/restaurants/${id}`);
  },

  // Get restaurant menu
  getRestaurantMenu: async (id: string): Promise<ApiResponse<MenuItem[]>> => {
    return apiClient.get<MenuItem[]>(`/restaurants/${id}/menu`);
  },

  // Search restaurants
  searchRestaurants: async (query: string, filters?: SearchFilters): Promise<ApiResponse<PaginatedResponse<Restaurant>>> => {
    return apiClient.get<PaginatedResponse<Restaurant>>('/restaurants/search', { q: query, ...filters });
  },

  // Get popular restaurants
  getPopularRestaurants: async (limit = 10): Promise<ApiResponse<Restaurant[]>> => {
    return apiClient.get<Restaurant[]>('/restaurants/popular', { limit });
  },

  // Get nearby restaurants
  getNearbyRestaurants: async (latitude: number, longitude: number, radius = 5): Promise<ApiResponse<Restaurant[]>> => {
    return apiClient.get<Restaurant[]>('/restaurants/nearby', { lat: latitude, lng: longitude, radius });
  },
};

// Order API
export const orderApi = {
  // Create new order
  createOrder: async (orderData: Partial<Order>): Promise<ApiResponse<Order>> => {
    return apiClient.post<Order>('/orders', orderData);
  },

  // Get user orders
  getUserOrders: async (userId: string, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    return apiClient.get<PaginatedResponse<Order>>(`/users/${userId}/orders`, { page, limit });
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  // Update order status
  updateOrderStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
    return apiClient.patch<Order>(`/orders/${id}/status`, { status });
  },

  // Cancel order
  cancelOrder: async (id: string, reason?: string): Promise<ApiResponse<Order>> => {
    return apiClient.patch<Order>(`/orders/${id}/cancel`, { reason });
  },

  // Track order
  trackOrder: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>(`/orders/${id}/track`);
  },
};

// User API
export const userApi = {
  // Get user profile
  getUserProfile: async (userId: string): Promise<ApiResponse<User>> => {
    return apiClient.get<User>(`/users/${userId}`);
  },

  // Update user profile
  updateUserProfile: async (userId: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.put<User>(`/users/${userId}`, userData);
  },

  // Update user preferences
  updateUserPreferences: async (userId: string, preferences: any): Promise<ApiResponse<User>> => {
    return apiClient.patch<User>(`/users/${userId}/preferences`, preferences);
  },

  // Add address
  addAddress: async (userId: string, address: any): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/users/${userId}/addresses`, address);
  },

  // Update address
  updateAddress: async (userId: string, addressId: string, address: any): Promise<ApiResponse<any>> => {
    return apiClient.put<any>(`/users/${userId}/addresses/${addressId}`, address);
  },

  // Delete address
  deleteAddress: async (userId: string, addressId: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<any>(`/users/${userId}/addresses/${addressId}`);
  },

  // Add payment method
  addPaymentMethod: async (userId: string, paymentMethod: any): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/users/${userId}/payment-methods`, paymentMethod);
  },

  // Update payment method
  updatePaymentMethod: async (userId: string, methodId: string, paymentMethod: any): Promise<ApiResponse<any>> => {
    return apiClient.put<any>(`/users/${userId}/payment-methods/${methodId}`, paymentMethod);
  },

  // Delete payment method
  deletePaymentMethod: async (userId: string, methodId: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<any>(`/users/${userId}/payment-methods/${methodId}`);
  },
};

// Review API
export const reviewApi = {
  // Get restaurant reviews
  getRestaurantReviews: async (restaurantId: string, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Review>>> => {
    return apiClient.get<PaginatedResponse<Review>>(`/restaurants/${restaurantId}/reviews`, { page, limit });
  },

  // Get menu item reviews
  getMenuItemReviews: async (itemId: string, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Review>>> => {
    return apiClient.get<PaginatedResponse<Review>>(`/menu-items/${itemId}/reviews`, { page, limit });
  },

  // Create review
  createReview: async (reviewData: Partial<Review>): Promise<ApiResponse<Review>> => {
    return apiClient.post<Review>('/reviews', reviewData);
  },

  // Update review
  updateReview: async (id: string, reviewData: Partial<Review>): Promise<ApiResponse<Review>> => {
    return apiClient.put<Review>(`/reviews/${id}`, reviewData);
  },

  // Delete review
  deleteReview: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<any>(`/reviews/${id}`);
  },

  // Mark review as helpful
  markReviewHelpful: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/reviews/${id}/helpful`);
  },
};

// Auth API
export const authApi = {
  // Login
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    return apiClient.post<{ token: string; user: User }>('/auth/login', { email, password });
  },

  // Register
  register: async (userData: any): Promise<ApiResponse<{ token: string; user: User }>> => {
    return apiClient.post<{ token: string; user: User }>('/auth/register', userData);
  },

  // Logout
  logout: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<any>('/auth/logout');
    apiClient.clearAuthToken();
    return response;
  },

  // Refresh token
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return apiClient.post<{ token: string }>('/auth/refresh');
  },

  // Reset password
  resetPassword: async (email: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>('/auth/reset-password', { email });
  },

  // Verify OTP
  verifyOTP: async (email: string, code: string): Promise<ApiResponse<{ token: string }>> => {
    return apiClient.post<any>('/auth/verify-otp', { email, code });
  },
};

// Export API client for direct usage
export { apiClient };

// Export auth token setter for global usage
export const setAuthToken = (token: string) => {
  apiClient.setAuthToken(token);
};

export const clearAuthToken = () => {
  apiClient.clearAuthToken();
};
