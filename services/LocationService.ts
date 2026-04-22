import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address, Restaurant } from '@/types';
import { restaurantApi } from './api';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

interface LocationAddress {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  formattedAddress?: string;
}

interface GeocodingResult {
  address: LocationAddress;
  coordinates: LocationCoordinates;
}

interface DeliveryEstimate {
  estimatedTime: string;
  distance: string;
  deliveryFee: number;
}

class LocationService {
  private readonly LOCATION_KEY = 'foodza_user_location';
  private readonly ADDRESSES_KEY = 'foodza_saved_addresses';
  private currentLocation: LocationCoordinates | null = null;
  private watchId: number | null = null;

  constructor() {
    this.initializeLocation();
  }

  /**
   * Initialize location service
   */
  private async initializeLocation(): Promise<void> {
    try {
      const savedLocation = await AsyncStorage.getItem(this.LOCATION_KEY);
      if (savedLocation) {
        this.currentLocation = JSON.parse(savedLocation);
      }
    } catch (error) {
      console.error('LocationService initialization error:', error);
    }
  }

  /**
   * Get current location
   */
  getCurrentLocation(): LocationCoordinates | null {
    return this.currentLocation;
  }

  /**
   * Request current location
   */
  async requestCurrentLocation(): Promise<{ success: boolean; location?: LocationCoordinates; error?: string }> {
    try {
      // In a real React Native app, you would use expo-location or react-native-location
      // For demo purposes, we'll simulate getting location
      
      await this.simulateNetworkDelay(1000);

      // Simulated Bamako coordinates
      const location: LocationCoordinates = {
        latitude: 12.6392,
        longitude: -8.0029,
      };

      this.currentLocation = location;
      await this.saveCurrentLocation(location);

      return { success: true, location };
    } catch (error) {
      console.error('LocationService.requestCurrentLocation error:', error);
      return { 
        success: false, 
        error: 'Failed to get current location' 
      };
    }
  }

  /**
   * Watch location changes
   */
  startLocationWatching(): void {
    try {
      // In a real app, you would use location watching
      // For demo purposes, we'll just log that watching started
      console.log('Location watching started');
      
      // Simulate location updates every 30 seconds
      this.watchId = setInterval(async () => {
        await this.requestCurrentLocation();
      }, 30000) as any;
    } catch (error) {
      console.error('LocationService.startLocationWatching error:', error);
    }
  }

  /**
   * Stop location watching
   */
  stopLocationWatching(): void {
    try {
      if (this.watchId) {
        clearInterval(this.watchId);
        this.watchId = null;
        console.log('Location watching stopped');
      }
    } catch (error) {
      console.error('LocationService.stopLocationWatching error:', error);
    }
  }

  /**
   * Get address from coordinates (reverse geocoding)
   */
  async getAddressFromCoordinates(coordinates: LocationCoordinates): Promise<{ success: boolean; address?: LocationAddress; error?: string }> {
    try {
      // Simulate reverse geocoding API call
      await this.simulateNetworkDelay(1500);

      // In production, this would use Google Maps API, OpenStreetMap, etc.
      const address: LocationAddress = {
        street: 'Avenue Cheick Zayed',
        city: 'Bamako',
        state: 'Bamako District',
        postalCode: '1234',
        country: 'Mali',
        formattedAddress: 'Avenue Cheick Zayed, Bamako, Mali',
      };

      return { success: true, address };
    } catch (error) {
      console.error('LocationService.getAddressFromCoordinates error:', error);
      return { 
        success: false, 
        error: 'Failed to get address from coordinates' 
      };
    }
  }

  /**
   * Get coordinates from address (geocoding)
   */
  async getCoordinatesFromAddress(address: Partial<LocationAddress>): Promise<{ success: boolean; coordinates?: LocationCoordinates; error?: string }> {
    try {
      // Simulate geocoding API call
      await this.simulateNetworkDelay(1500);

      // In production, this would use Google Maps API, OpenStreetMap, etc.
      const coordinates: LocationCoordinates = {
        latitude: 12.6392,
        longitude: -8.0029,
      };

      return { success: true, coordinates };
    } catch (error) {
      console.error('LocationService.getCoordinatesFromAddress error:', error);
      return { 
        success: false, 
        error: 'Failed to get coordinates from address' 
      };
    }
  }

  /**
   * Get nearby restaurants
   */
  async getNearbyRestaurants(radius = 5): Promise<{ success: boolean; restaurants?: Restaurant[]; error?: string }> {
    try {
      if (!this.currentLocation) {
        const locationResult = await this.requestCurrentLocation();
        if (!locationResult.success) {
          return { success: false, error: 'Location not available' };
        }
      }

      const response = await restaurantApi.getNearbyRestaurants(
        this.currentLocation!.latitude,
        this.currentLocation!.longitude,
        radius
      );

      if (response.success && response.data) {
        return { success: true, restaurants: response.data };
      }

      return { 
        success: false, 
        error: response.error?.message || 'Failed to get nearby restaurants' 
      };
    } catch (error) {
      console.error('LocationService.getNearbyRestaurants error:', error);
      return { 
        success: false, 
        error: 'Network error while fetching nearby restaurants' 
      };
    }
  }

  /**
   * Calculate delivery estimate
   */
  async calculateDeliveryEstimate(restaurantId: string, deliveryAddress: Address): Promise<{ success: boolean; estimate?: DeliveryEstimate; error?: string }> {
    try {
      // Get restaurant details
      const restaurantResponse = await restaurantApi.getRestaurantById(restaurantId);
      if (!restaurantResponse.success || !restaurantResponse.data) {
        return { success: false, error: 'Restaurant not found' };
      }

      const restaurant = restaurantResponse.data;
      
      // Get coordinates for delivery address
      const deliveryCoordsResult = await this.getCoordinatesFromAddress(deliveryAddress);
      if (!deliveryCoordsResult.success) {
        return { success: false, error: 'Invalid delivery address' };
      }

      // Simulate distance and time calculation
      await this.simulateNetworkDelay(1000);

      const distance = this.calculateDistance(
        { latitude: 12.6392, longitude: -8.0029 }, // Restaurant coords (simulated)
        deliveryCoordsResult.coordinates!
      );

      const estimatedTime = this.calculateDeliveryTime(distance);
      const deliveryFee = this.calculateDeliveryFee(distance);

      const estimate: DeliveryEstimate = {
        estimatedTime,
        distance: `${distance.toFixed(1)} km`,
        deliveryFee,
      };

      return { success: true, estimate };
    } catch (error) {
      console.error('LocationService.calculateDeliveryEstimate error:', error);
      return { 
        success: false, 
        error: 'Failed to calculate delivery estimate' 
      };
    }
  }

  /**
   * Save address
   */
  async saveAddress(address: Address): Promise<{ success: boolean; error?: string }> {
    try {
      const addresses = await this.getSavedAddresses();
      
      // Check if address already exists
      const exists = addresses.some(addr => addr.id === address.id);
      if (exists) {
        return { success: false, error: 'Address already exists' };
      }

      addresses.push(address);
      await AsyncStorage.setItem(this.ADDRESSES_KEY, JSON.stringify(addresses));
      
      return { success: true };
    } catch (error) {
      console.error('LocationService.saveAddress error:', error);
      return { success: false, error: 'Failed to save address' };
    }
  }

  /**
   * Get saved addresses
   */
  async getSavedAddresses(): Promise<Address[]> {
    try {
      const stored = await AsyncStorage.getItem(this.ADDRESSES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('LocationService.getSavedAddresses error:', error);
      return [];
    }
  }

  /**
   * Update address
   */
  async updateAddress(addressId: string, updates: Partial<Address>): Promise<{ success: boolean; error?: string }> {
    try {
      const addresses = await this.getSavedAddresses();
      const index = addresses.findIndex(addr => addr.id === addressId);
      
      if (index === -1) {
        return { success: false, error: 'Address not found' };
      }

      // Handle default address logic
      if (updates.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
      }

      addresses[index] = { ...addresses[index], ...updates };
      await AsyncStorage.setItem(this.ADDRESSES_KEY, JSON.stringify(addresses));
      
      return { success: true };
    } catch (error) {
      console.error('LocationService.updateAddress error:', error);
      return { success: false, error: 'Failed to update address' };
    }
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const addresses = await this.getSavedAddresses();
      const filteredAddresses = addresses.filter(addr => addr.id !== addressId);
      
      if (filteredAddresses.length === addresses.length) {
        return { success: false, error: 'Address not found' };
      }

      await AsyncStorage.setItem(this.ADDRESSES_KEY, JSON.stringify(filteredAddresses));
      
      return { success: true };
    } catch (error) {
      console.error('LocationService.deleteAddress error:', error);
      return { success: false, error: 'Failed to delete address' };
    }
  }

  /**
   * Set default address
   */
  async setDefaultAddress(addressId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const addresses = await this.getSavedAddresses();
      const addressExists = addresses.some(addr => addr.id === addressId);
      
      if (!addressExists) {
        return { success: false, error: 'Address not found' };
      }

      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));

      await AsyncStorage.setItem(this.ADDRESSES_KEY, JSON.stringify(updatedAddresses));
      
      return { success: true };
    } catch (error) {
      console.error('LocationService.setDefaultAddress error:', error);
      return { success: false, error: 'Failed to set default address' };
    }
  }

  /**
   * Save current location to storage
   */
  private async saveCurrentLocation(location: LocationCoordinates): Promise<void> {
    try {
      this.currentLocation = location;
      await AsyncStorage.setItem(this.LOCATION_KEY, JSON.stringify(location));
    } catch (error) {
      console.error('LocationService.saveCurrentLocation error:', error);
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(coord1: LocationCoordinates, coord2: LocationCoordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) * Math.cos(this.toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate delivery time based on distance
   */
  private calculateDeliveryTime(distance: number): string {
    const baseTime = 20; // Base preparation time in minutes
    const travelTime = Math.ceil(distance * 10); // 10 minutes per km
    const totalTime = baseTime + travelTime;
    
    return `${totalTime}-${totalTime + 10} min`;
  }

  /**
   * Calculate delivery fee based on distance
   */
  private calculateDeliveryFee(distance: number): number {
    const baseFee = 300; // Base delivery fee in CFA
    const distanceFee = Math.ceil(distance * 200); // 200 CFA per km
    return baseFee + distanceFee;
  }

  /**
   * Simulate network delay for demo purposes
   */
  private simulateNetworkDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if location permissions are granted
   */
  async checkLocationPermissions(): Promise<{ granted: boolean; canAskAgain: boolean }> {
    try {
      // In a real app, you would check actual permissions
      // For demo purposes, we'll return granted
      return { granted: true, canAskAgain: true };
    } catch (error) {
      console.error('LocationService.checkLocationPermissions error:', error);
      return { granted: false, canAskAgain: false };
    }
  }

  /**
   * Request location permissions
   */
  async requestLocationPermissions(): Promise<{ granted: boolean; error?: string }> {
    try {
      // In a real app, you would request actual permissions
      // For demo purposes, we'll return granted
      return { granted: true };
    } catch (error) {
      console.error('LocationService.requestLocationPermissions error:', error);
      return { granted: false, error: 'Failed to request location permissions' };
    }
  }
}

// Export singleton instance
const locationService = new LocationService();
export default locationService;

// Export the class for static method access
export { LocationService };
