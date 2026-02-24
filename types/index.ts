// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  favoriteCuisines: string[];
  notifications: NotificationSettings;
  language: string;
  currency: string;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  favoriteRestaurants: string[];
  reviewsCount: number;
  averageRating: number;
  memberSince: Date;
  loyaltyPoints: number;
}

// Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  priceRange: string;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  address: Address;
  phone: string;
  email: string;
  isOpen: boolean;
  discount?: Discount;
  menu: MenuCategory[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  available: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo?: NutritionalInfo;
  variants?: MenuItemVariant[];
  extras?: MenuItemExtra[];
  rating?: number;
  reviewCount?: number;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

export interface MenuItemVariant {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemExtra {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryFee: number;
  tax: number;
  discount?: Discount;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  tracking?: OrderTracking;
  review?: Review;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: MenuItemVariant;
  extras: MenuItemExtra[];
  specialInstructions?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderTracking {
  status: OrderStatus;
  estimatedTime: Date;
  driver?: Driver;
  location?: {
    latitude: number;
    longitude: number;
  };
  updates: TrackingUpdate[];
}

export interface TrackingUpdate {
  timestamp: Date;
  status: OrderStatus;
  message: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
  vehicle: string;
  licensePlate: string;
}

// Address types
export interface Address {
  id: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  instructions?: string;
}

// Payment types
export interface PaymentMethod {
  id: string;
  type: PaymentType;
  isDefault: boolean;
  details: PaymentDetails;
}

export type PaymentType = 'card' | 'mobile_money' | 'cash' | 'wallet';

export interface PaymentDetails {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  holderName?: string;
  brand?: string;
  mobileProvider?: string;
  mobileNumber?: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  applicableItems?: string[];
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usageCount?: number;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  orderId: string;
  restaurantId?: string;
  menuItemId?: string;
  rating: number;
  comment: string;
  photos: string[];
  helpfulCount: number;
  createdAt: Date;
  isVerified: boolean;
}

// Search and Filter types
export interface SearchFilters {
  query?: string;
  cuisine?: string[];
  priceRange?: string[];
  rating?: number;
  deliveryTime?: number;
  distance?: number;
  dietary?: string[];
  sortBy?: SortOption;
  isOpen?: boolean;
  hasDiscount?: boolean;
}

export type SortOption = 
  | 'relevance'
  | 'rating'
  | 'delivery_time'
  | 'delivery_fee'
  | 'price_low'
  | 'price_high'
  | 'newest';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Navigation types
export type RootStackParamList = {
  index: undefined;
  home: undefined;
  onboarding: { screen: string };
  restaurant: { id: string };
  order: undefined;
  'screens/profile': undefined;
  'screens/settings': undefined;
  'screens/assistant': undefined;
  modal: undefined;
};

// Component Props types
export interface BaseComponentProps {
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
