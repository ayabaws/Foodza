import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Restaurant {
  id: string;
  name: string;
  image: any;
  rating: number;
  priceRange: string;
  category?: string;
  address?: string;
}

interface Dish {
  id: string;
  name: string;
  image: any;
  price: number;
  description: string;
  category?: string;
  rating?: number;
  priceRange?: string;
}

interface FavoritesContextType {
  favorites: (Restaurant | Dish)[];
  addToFavorites: (item: Restaurant | Dish) => void;
  removeFromFavorites: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (item: Restaurant | Dish) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<(Restaurant | Dish)[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      // Check if AsyncStorage is available
      if (!AsyncStorage) {
        console.log('AsyncStorage not available, using empty favorites');
        return;
      }

      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.log('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (newFavorites: (Restaurant | Dish)[]) => {
    try {
      // Check if AsyncStorage is available
      if (!AsyncStorage) {
        console.log('AsyncStorage not available, skipping save');
        return;
      }
      
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.log('Error saving favorites:', error);
    }
  };

  const addToFavorites = (item: Restaurant | Dish) => {
    const newFavorites = [...favorites, item];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const removeFromFavorites = (itemId: string) => {
    const newFavorites = favorites.filter(r => r.id !== itemId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const isFavorite = (itemId: string): boolean => {
    return favorites.some(r => r.id === itemId);
  };

  const toggleFavorite = (item: Restaurant | Dish) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
