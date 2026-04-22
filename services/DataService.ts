import appData from '../data/app-data.json';

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  cuisine: string;
  distance: string;
  address: string;
  discount?: string;
}

export interface PopularItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  priceRange: string;
  discount?: string;
  category?: string;
  description?: string;
}

export interface Dish {
  id: string;
  name: string;
  image: string;
  price: string;
  description: string;
  category: string;
  rating: number;
  priceRange: string;
  deliveryTime: string;
  discount?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  initials: string;
}

export interface Settings {
  theme: {
    darkMode: boolean;
  };
  notifications: {
    enabled: boolean;
    promotions: boolean;
    orders: boolean;
    reviews: boolean;
  };
  language: string;
}

class DataService {
  private data: {
    categories: Category[];
    restaurants: Restaurant[];
    popularItems: PopularItem[];
    dishes: Dish[];
    userProfile: UserProfile;
    settings: Settings;
  } = appData;

  // Helper method pour convertir les chemins d'images en require()
  private getCategoryImage(imageName: string): any {
    const imageMap: { [key: string]: any } = {
      'all.png': require('@/assets/home/all.png'),
      'pizza.png': require('@/assets/home/pizza.png'),
      'jus.webp': require('@/assets/home/jus.webp'),
      'local.png': require('@/assets/home/local.png'),
      'grill.png': require('@/assets/home/grill.png'),
    };
    return imageMap[imageName] || require('@/assets/home/all.png');
  }

  // Categories
  getCategories(): Category[] {
    return this.data.categories.map(cat => ({
      ...cat,
      image: this.getCategoryImage(cat.image)
    }));
  }

  getCategoryById(id: string): Category | undefined {
    const category = this.data.categories.find(cat => cat.id === id);
    if (!category) return undefined;
    return {
      ...category,
      image: this.getCategoryImage(category.image)
    };
  }

  getCategoryByName(name: string): Category | undefined {
    const category = this.data.categories.find(cat => cat.name === name);
    if (!category) return undefined;
    return {
      ...category,
      image: this.getCategoryImage(category.image)
    };
  }

  // Restaurants
  getRestaurants(): Restaurant[] {
    return this.data.restaurants;
  }

  getRestaurantById(id: string): Restaurant | undefined {
    return this.data.restaurants.find(resto => resto.id === id);
  }

  getRestaurantsByCategory(category: string): Restaurant[] {
    if (category === 'Tous') return this.data.restaurants;
    return this.data.restaurants.filter(resto => resto.cuisine === category);
  }

  // Popular Items
  getPopularItems(): PopularItem[] {
    return this.data.popularItems;
  }

  getPopularItemById(id: string): PopularItem | undefined {
    return this.data.popularItems.find(item => item.id === id);
  }

  getPopularItemsByCategory(category: string): PopularItem[] {
    if (category === 'Tous') return this.data.popularItems;
    return this.data.popularItems.filter(item => item.category === category);
  }

  // Dishes
  getDishes(): Dish[] {
    return this.data.dishes;
  }

  getDishById(id: string): Dish | undefined {
    return this.data.dishes.find(dish => dish.id === id);
  }

  getDishesByCategory(category: string): Dish[] {
    if (category === 'Tous') return this.data.dishes;
    return this.data.dishes.filter(dish => dish.category === category);
  }

  searchDishes(query: string): Dish[] {
    const lowercaseQuery = query.toLowerCase();
    return this.data.dishes.filter(dish => 
      dish.name.toLowerCase().includes(lowercaseQuery) ||
      dish.description.toLowerCase().includes(lowercaseQuery) ||
      dish.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  searchRestaurants(query: string): Restaurant[] {
    const lowercaseQuery = query.toLowerCase();
    return this.data.restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(lowercaseQuery) ||
      restaurant.cuisine.toLowerCase().includes(lowercaseQuery) ||
      restaurant.address.toLowerCase().includes(lowercaseQuery)
    );
  }

  // User Profile
  getUserProfile(): UserProfile {
    return this.data.userProfile;
  }

  updateUserProfile(updates: Partial<UserProfile>): void {
    this.data.userProfile = { ...this.data.userProfile, ...updates };
  }

  // Settings
  getSettings(): Settings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<Settings>): void {
    this.data.settings = { ...this.data.settings, ...updates };
  }

  clearUserData(): void {
    // Réinitialiser les données utilisateur par défaut
    this.data.userProfile = {
      name: 'Utilisateur',
      email: 'user@example.com',
      phone: '+221 33 123 456 78',
      avatarUrl: null,
      initials: 'U'
    };
    this.data.settings = {
      theme: {
        darkMode: false
      },
      notifications: {
        enabled: true,
        promotions: true,
        orders: true,
        reviews: true
      },
      language: 'fr'
    };
  }

  // Utility methods
  getAllUniqueCategories(): string[] {
    const categories = new Set<string>();
    
    // Add categories from categories array
    this.data.categories.forEach(cat => categories.add(cat.name));
    
    // Add categories from dishes
    this.data.dishes.forEach(dish => categories.add(dish.category));
    
    // Add categories from popular items
    this.data.popularItems.forEach(item => {
      if (item.category) categories.add(item.category);
    });
    
    return Array.from(categories);
  }

  getTopRatedDishes(limit: number = 5): Dish[] {
    return [...this.data.dishes]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getTopRatedRestaurants(limit: number = 5): Restaurant[] {
    return [...this.data.restaurants]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getDishesWithDiscount(): Dish[] {
    return this.data.dishes.filter(dish => dish.discount);
  }

  getRestaurantsWithDiscount(): Restaurant[] {
    return this.data.restaurants.filter(restaurant => restaurant.discount);
  }

  // Filter methods
  filterDishes(filters: {
    category?: string;
    minRating?: number;
    maxPrice?: number;
    hasDiscount?: boolean;
  }): Dish[] {
    return this.data.dishes.filter(dish => {
      if (filters.category && filters.category !== 'Tous' && dish.category !== filters.category) {
        return false;
      }
      if (filters.minRating && dish.rating < filters.minRating) {
        return false;
      }
      if (filters.maxPrice) {
        const price = parseInt(dish.price.replace(' CFA', '').replace(' FCFA', ''));
        if (price > filters.maxPrice) {
          return false;
        }
      }
      if (filters.hasDiscount && !dish.discount) {
        return false;
      }
      return true;
    });
  }

  filterRestaurants(filters: {
    cuisine?: string;
    minRating?: number;
    maxDeliveryFee?: number;
    hasDiscount?: boolean;
  }): Restaurant[] {
    return this.data.restaurants.filter(restaurant => {
      if (filters.cuisine && filters.cuisine !== 'Tous' && restaurant.cuisine !== filters.cuisine) {
        return false;
      }
      if (filters.minRating && restaurant.rating < filters.minRating) {
        return false;
      }
      if (filters.maxDeliveryFee) {
        const fee = parseInt(restaurant.deliveryFee.replace(' FCFA', '').replace(' CFA', ''));
        if (fee > filters.maxDeliveryFee) {
          return false;
        }
      }
      if (filters.hasDiscount && !restaurant.discount) {
        return false;
      }
      return true;
    });
  }
}

// Export singleton instance
export const dataService = new DataService();
export default dataService;
