import { useState, useEffect } from 'react';

// Generic localStorage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    // Listen for changes to localStorage
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}

// Specific hooks for common use cases
export function useUserPreferences() {
  return useLocalStorage('userPreferences', {
    dietaryRestrictions: [] as string[],
    favoriteCuisines: [] as string[],
    notifications: {
      push: true,
      email: true,
      sms: false,
      orderUpdates: true,
      promotions: true,
      newsletter: false,
    },
    language: 'fr',
    currency: 'XOF',
  });
}

export function useCart() {
  return useLocalStorage('cart', {
    items: [],
    restaurantId: null,
    totalAmount: 0,
    deliveryFee: 500,
    discount: null,
  });
}

export function useFavorites() {
  return useLocalStorage('favorites', {
    restaurants: [] as string[],
    menuItems: [] as string[],
  });
}

export function useOrderHistory() {
  return useLocalStorage('orderHistory', [] as any[]);
}

export function useAddresses() {
  return useLocalStorage('addresses', [] as any[]);
}

export function usePaymentMethods() {
  return useLocalStorage('paymentMethods', [] as any[]);
}

export function useAppSettings() {
  return useLocalStorage('appSettings', {
    darkMode: false,
    language: 'fr',
    currency: 'XOF',
    location: {
      enabled: true,
      latitude: null,
      longitude: null,
      address: '',
    },
    notifications: {
      enabled: true,
      sound: true,
      vibration: true,
    },
  });
}
