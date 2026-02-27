import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Address {
  id: string;
  label: string;
  street: string;
  coordinates?: { latitude: number; longitude: number };
  isDefault?: boolean;
}

interface LocationContextType {
  currentLocation: Address | null;
  savedAddresses: Address[];
  setCurrentLocation: (location: Address) => void;
  addSavedAddress: (address: Address) => void;
  updateSavedAddress: (address: Address) => void;
  deleteSavedAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<Address | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);

  const addSavedAddress = (address: Address) => {
    setSavedAddresses(prev => [...prev, { ...address, id: Date.now().toString() }]);
  };

  const updateSavedAddress = (address: Address) => {
    setSavedAddresses(prev => 
      prev.map(addr => addr.id === address.id ? address : addr)
    );
  };

  const deleteSavedAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setSavedAddresses(prev => 
      prev.map(addr => ({ ...addr, isDefault: addr.id === id }))
    );
  };

  return (
    <LocationContext.Provider value={{
      currentLocation,
      savedAddresses,
      setCurrentLocation,
      addSavedAddress,
      updateSavedAddress,
      deleteSavedAddress,
      setDefaultAddress
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
