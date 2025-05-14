import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Clock, Loader2, RefreshCw, CopyCheck } from 'lucide-react';
import { Order } from '../../types';
import { getOrderById } from '../../services/orderService';
import { getGamepassDetails } from '../../services/robloxApi';

const OrderStatus: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [gamepass, setGamepass] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Polling interval (in ms)
  const POLLING_INTERVAL = 10000; // 10 seconds
  
  useEffect(() => {
    // Load order details
    const loadOrderDetails = async () => {
      try {
        setIsLoading(true);
        
        if (!orderId) {
          setError('Order ID is required');
          return;
        }
        
        const orderData = getOrderById(orderId);
        
        if (!orderData) {
          setError('Order not found');
          return;
        }
        
        setOrder(orderData);
        
        // Load gamepass details
        const gamepassData = await getGamepassDetails(orderData.gamepassId);
        setGamepass(gamepassData);
      } catch (err) {
        setError('Error loading order details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrderDetails();
    
    // Set up polling for order updates
    const pollingInterval = setInterval(() => {
      if (orderId) {
        const updatedOrder = getOrderById(orderId);
        if (updatedOrder) {
          setOrder(updatedOrder);
          
          // Stop polling if the order is completed, failed, or expired
          if (['completed', 'failed', 'expired'].includes(updatedOrder.status)) {
            clearInterval(pollingInterval);
          }
        }
      }
    }, POLLING_INTERVAL);
    
    // Clean up the interval on unmount
    return () => clearInterval(pollingInterval);
  }, [orderId]);
  
  const refreshOrder = () => {
    if (!orderId) return;
    
    setRefreshing(true);
    const updatedOrder = getOrderById(orderId);
    if (updatedOrder) {
      setOrder(updatedOrder);
    }
    
    // Simulate a slight delay for the refresh animation
    setTimeout(() => setRefreshing(false), 1000);
  };
  
  const copySerialKey = () => {
    if (order?.serialKey) {
      navigator.clipboard.writeText(order.serialKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
      case 'expired':
        return 'text-red-600';
      case 'monitoring':
        return 'text-blue-600';
      default:
        return 'text-yellow-600';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'failed':
      case 'expired':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      case 'monitoring':
        return <Clock className="h-6 w-6 text-blue-600" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-600" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error || 'Order not found'}</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Return Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Status</h2>
        <button
          onClick={refreshOrder}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          disabled={refreshing}
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          {getStatusIcon(order.status)}
          <div className="ml-3">
            <h3 className="font-bold">
              Status:{' '}
              <span className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </h3>
            <p className="text-sm text-gray-500">
              Order #{order.id.slice(0, 8)}
            </p>
          </div>
        </div>
        
        {gamepass && (
          <div className="flex items-center p-3 bg-gray-50 rounded-md">
            <img
              src={gamepass.imageUrl}
              alt={gamepass.name}
              className="w-12 h-12 object-cover rounded-md mr-3"
            />
            <div>
              <h4 className="font-medium">{gamepass.name}</h4>
              <p className="text-green-600 text-sm">R$ {gamepass.price}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">
          Account Details
        </h3>
        <p className="text-gray-800">
          <span className="font-medium">Roblox Username:</span> {order.robloxUsername}
        </p>
      </div>
      
      {order.status === 'completed' && order.serialKey && (
        <div className="mb-6">
          <h3 className="text-sm uppercase font-semibold text-green-600 mb-2">
            Serial Key
          </h3>
          <div className="relative">
            <div className="bg-gray-100 p-3 rounded-md font-mono text-center break-all">
              {order.serialKey}
            </div>
            <button
              onClick={copySerialKey}
              className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <CopyCheck className="h-5 w-5 text-green-600" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 mt-1 text-center">
              Copied to clipboard!
            </p>
          )}
        </div>
      )}
      
      {order.status === 'monitoring' && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Waiting for Purchase Confirmation
          </h3>
          <p className="text-sm text-blue-600">
            Please purchase the gamepass on Roblox to receive your serial key.
            We'll automatically detect your purchase and update this page.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="bg-white rounded-md p-2 text-center">
              <p className="text-xs text-gray-500">Order Created</p>
              <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mt-1" />
            </div>
            <div className="bg-white rounded-md p-2 text-center">
              <p className="text-xs text-gray-500">Purchase</p>
              <div className="h-5 w-5 mx-auto mt-1">
                <div className="h-3 w-3 bg-blue-600 rounded-full animate-ping mx-auto" />
              </div>
            </div>
            <div className="bg-white rounded-md p-2 text-center">
              <p className="text-xs text-gray-500">Delivery</p>
              <Clock className="h-5 w-5 text-gray-400 mx-auto mt-1" />
            </div>
          </div>
        </div>
      )}
      
      {(order.status === 'failed' || order.status === 'expired') && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <h3 className="font-semibold text-red-700 mb-2 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {order.status === 'failed' ? 'Purchase Failed' : 'Monitoring Expired'}
          </h3>
          <p className="text-sm text-red-600">
            {order.status === 'failed'
              ? 'We were unable to detect your gamepass purchase after multiple attempts.'
              : 'The monitoring period for this order has expired.'}
          </p>
          <Link
            to="/order"
            className="inline-block mt-3 bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-red-800"
          >
            Try Again
          </Link>
        </div>
      )}
      
      <div className="mt-6 flex justify-between">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Return Home
        </Link>
        <Link
          to="/order"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Place Another Order
        </Link>
      </div>
    </div>
  );
};

export default OrderStatus;