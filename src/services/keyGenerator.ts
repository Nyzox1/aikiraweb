import { nanoid } from 'nanoid';
import { SerialKey } from '../types';

// In a real application, this would connect to a database
// For this example, we'll use localStorage to persist keys
const KEYS_STORAGE_KEY = 'roblox-gamepass-serial-keys';

/**
 * Loads all keys from storage
 */
const getKeys = (): SerialKey[] => {
  try {
    const keysJson = localStorage.getItem(KEYS_STORAGE_KEY);
    return keysJson ? JSON.parse(keysJson) : [];
  } catch (error) {
    console.error('Error loading keys:', error);
    return [];
  }
};

/**
 * Saves all keys to storage
 */
const saveKeys = (keys: SerialKey[]): void => {
  try {
    localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys));
  } catch (error) {
    console.error('Error saving keys:', error);
  }
};

/**
 * Generates a new serial key for an order
 */
export const generateSerialKey = (orderId: string): SerialKey => {
  // Generate a secure serial key
  // Format: XXXX-XXXX-XXXX-XXXX (where X is alphanumeric)
  const keyParts = [];
  for (let i = 0; i < 4; i++) {
    keyParts.push(nanoid(4).toUpperCase());
  }
  
  const serialKey: SerialKey = {
    key: keyParts.join('-'),
    orderId,
    isUsed: false,
    createdAt: new Date()
  };
  
  // Save the key
  const keys = getKeys();
  keys.push(serialKey);
  saveKeys(keys);
  
  return serialKey;
};

/**
 * Validates a serial key
 */
export const validateSerialKey = (key: string): boolean => {
  const keys = getKeys();
  const foundKey = keys.find(k => k.key === key);
  
  if (!foundKey || foundKey.isUsed) {
    return false;
  }
  
  return true;
};

/**
 * Marks a serial key as used
 */
export const markKeyAsUsed = (key: string): boolean => {
  const keys = getKeys();
  const keyIndex = keys.findIndex(k => k.key === key);
  
  if (keyIndex === -1) {
    return false;
  }
  
  keys[keyIndex].isUsed = true;
  saveKeys(keys);
  
  return true;
};