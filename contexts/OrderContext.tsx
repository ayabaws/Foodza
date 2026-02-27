import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OrderContextType {
  isOrderActive: boolean;
  orderData: {
    restaurantName: string;
    estimatedTime: string;
    items: Array<{ id: string; name: string; image: string }>;
  } | null;
  startOrder: (data: { restaurantName: string; estimatedTime: string; items: Array<{ id: string; name: string; image: string }> }) => void;
  completeOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [isOrderActive, setIsOrderActive] = useState(false);
  const [orderData, setOrderData] = useState<OrderContextType['orderData']>(null);

  const startOrder = (data: OrderContextType['orderData']) => {
    setOrderData(data);
    setIsOrderActive(true);
  };

  const completeOrder = () => {
    setIsOrderActive(false);
    setOrderData(null);
  };

  return (
    <OrderContext.Provider value={{ isOrderActive, orderData, startOrder, completeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
