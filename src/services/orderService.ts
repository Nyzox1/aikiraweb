import { nanoid } from 'nanoid';
import { Order, OrderStatus, MonitoringConfig } from '../types';

// In a real application, this would connect to a database
// For this example, we'll use localStorage to persist orders
const ORDERS_STORAGE_KEY = 'roblox-gamepass-orders';

// Default monitoring configuration
export const DEFAULT_MONITORING_CONFIG: MonitoringConfig = {
  checkIntervalSeconds: 30,
  maxMonitoringHours: 24,
  maxAttempts: 20
};

/**
 * Loads all orders from storage
 */
export const getOrders = (): Order[] => {
  try {
    const ordersJson = localStorage.getItem(ORDERS_STORAGE_KEY);
    return ordersJson ? JSON.parse(ordersJson) : [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

/**
 * Saves all orders to storage
 */
const saveOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
};

/**
 * Creates a new order
 */
export const createOrder = (
  robloxUsername: string,
  gamepassId: number
): Order => {
  const orders = getOrders();
  
  const now = new Date();
  const monitoringExpiry = new Date(now);
  monitoringExpiry.setHours(
    monitoringExpiry.getHours() + DEFAULT_MONITORING_CONFIG.maxMonitoringHours
  );
  
  const newOrder: Order = {
    id: nanoid(),
    robloxUsername,
    gamepassId,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    monitoringExpiry,
    monitoringAttempts: 0
  };
  
  orders.push(newOrder);
  saveOrders(orders);
  
  return newOrder;
};

/**
 * Gets an order by ID
 */
export const getOrderById = (orderId: string): Order | undefined => {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
};

/**
 * Updates an order's status
 */
export const updateOrderStatus = (
  orderId: string,
  status: OrderStatus,
  serialKey?: string
): Order | undefined => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return undefined;
  }
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date(),
    serialKey: serialKey || orders[orderIndex].serialKey,
    monitoringAttempts: (orders[orderIndex].monitoringAttempts || 0) + 1
  };
  
  saveOrders(orders);
  return orders[orderIndex];
};

/**
 * Gets all orders for a specific Roblox username
 */
export const getOrdersByUsername = (username: string): Order[] => {
  const orders = getOrders();
  return orders.filter(
    order => order.robloxUsername.toLowerCase() === username.toLowerCase()
  );
};

/**
 * Gets orders that need monitoring (pending and not expired)
 */
export const getOrdersForMonitoring = (): Order[] => {
  const orders = getOrders();
  const now = new Date();
  
  return orders.filter(order => {
    // Only monitor orders in "monitoring" state
    if (order.status !== 'monitoring') {
      return false;
    }
    
    // Skip expired orders
    if (order.monitoringExpiry && new Date(order.monitoringExpiry) < now) {
      // Auto-update expired orders
      updateOrderStatus(order.id, 'expired');
      return false;
    }
    
    // Skip orders that exceeded max attempts
    if ((order.monitoringAttempts || 0) >= DEFAULT_MONITORING_CONFIG.maxAttempts) {
      updateOrderStatus(order.id, 'failed');
      return false;
    }
    
    return true;
  });
};