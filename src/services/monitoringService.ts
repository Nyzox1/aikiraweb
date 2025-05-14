import { Order } from '../types';
import { getOrdersForMonitoring, updateOrderStatus, DEFAULT_MONITORING_CONFIG } from './orderService';
import { checkGamepassPurchase } from './robloxApi';
import { generateSerialKey } from './keyGenerator';

let monitoringInterval: number | null = null;

/**
 * Starts the monitoring service to check for completed gamepass purchases
 */
export const startMonitoringService = (): void => {
  if (monitoringInterval !== null) {
    stopMonitoringService();
  }
  
  console.log('Starting purchase monitoring service...');
  
  // Set up the monitoring interval
  monitoringInterval = setInterval(
    checkPendingPurchases,
    DEFAULT_MONITORING_CONFIG.checkIntervalSeconds * 1000
  );
  
  // Run an initial check immediately
  checkPendingPurchases();
};

/**
 * Stops the monitoring service
 */
export const stopMonitoringService = (): void => {
  if (monitoringInterval !== null) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
    console.log('Monitoring service stopped');
  }
};

/**
 * Checks all pending orders for completed purchases
 */
const checkPendingPurchases = async (): Promise<void> => {
  const ordersToMonitor = getOrdersForMonitoring();
  
  if (ordersToMonitor.length === 0) {
    return;
  }
  
  console.log(`Checking ${ordersToMonitor.length} pending orders...`);
  
  // Check each order in parallel
  const checkPromises = ordersToMonitor.map(checkOrderPurchase);
  await Promise.all(checkPromises);
};

/**
 * Checks an individual order for purchase completion
 */
const checkOrderPurchase = async (order: Order): Promise<void> => {
  try {
    console.log(`Checking purchase for order ${order.id} (${order.robloxUsername})...`);
    
    // Check if the user has purchased the gamepass
    const hasPurchased = await checkGamepassPurchase(
      order.robloxUsername,
      order.gamepassId
    );
    
    if (hasPurchased) {
      console.log(`Purchase verified for order ${order.id}!`);
      
      // Generate a serial key
      const serialKey = generateSerialKey(order.id);
      
      // Update the order status
      updateOrderStatus(order.id, 'completed', serialKey.key);
      
      // In a real app, you would notify the user here
      // e.g., send an email or update a real-time notification
    } else {
      console.log(`No purchase detected yet for order ${order.id}`);
      
      // Update the monitoring attempts
      updateOrderStatus(order.id, 'monitoring');
    }
  } catch (error) {
    console.error(`Error checking purchase for order ${order.id}:`, error);
  }
};

/**
 * Starts monitoring a specific order
 */
export const startOrderMonitoring = (orderId: string): void => {
  // Update the order status to monitoring
  updateOrderStatus(orderId, 'monitoring');
  
  // Start the monitoring service if it's not already running
  if (monitoringInterval === null) {
    startMonitoringService();
  }
};