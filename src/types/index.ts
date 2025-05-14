// Common types used throughout the application

export interface Order {
  id: string;
  robloxUsername: string;
  gamepassId: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  serialKey?: string;
  monitoringExpiry?: Date;
  monitoringAttempts?: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'monitoring' 
  | 'completed' 
  | 'failed' 
  | 'expired';

export interface Gamepass {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface RobloxUser {
  username: string;
  displayName?: string;
  id?: number;
  isValid: boolean;
}

export interface MonitoringConfig {
  checkIntervalSeconds: number;
  maxMonitoringHours: number;
  maxAttempts: number;
}

export interface SerialKey {
  key: string;
  orderId: string;
  isUsed: boolean;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}