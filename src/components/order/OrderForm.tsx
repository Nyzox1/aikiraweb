import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Gamepass } from '../../types';
import { validateRobloxUsername, getGamepassDetails } from '../../services/robloxApi';
import { createOrder } from '../../services/orderService';
import { startOrderMonitoring } from '../../services/monitoringService';

interface OrderFormProps {
  gamepassId?: number;
}

const OrderForm: React.FC<OrderFormProps> = ({ gamepassId = 12345 }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [gamepass, setGamepass] = useState<Gamepass | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Load gamepass details
  useEffect(() => {
    const loadGamepass = async () => {
      try {
        setIsLoading(true);
        const details = await getGamepassDetails(gamepassId);
        setGamepass(details);
      } catch (err) {
        setError('Failed to load gamepass details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGamepass();
  }, [gamepassId]);
  
  // Validate username when it changes
  useEffect(() => {
    // Reset validation state
    setIsValid(null);
    setError(null);
    
    if (!username || username.trim() === '') {
      return;
    }
    
    // Debounce the validation
    const timer = setTimeout(async () => {
      try {
        setIsValidating(true);
        const result = await validateRobloxUsername(username);
        setIsValid(result.isValid);
        
        if (!result.isValid) {
          setError('Invalid Roblox username. Please check and try again.');
        }
      } catch (err) {
        setError('Error validating username. Please try again.');
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [username]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !isValid || !gamepass) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create the order
      const order = createOrder(username, gamepassId);
      
      // Start monitoring for the purchase
      startOrderMonitoring(order.id);
      
      // Redirect to the order status page
      navigate(`/order/${order.id}`);
    } catch (err) {
      setError('Failed to create order. Please try again.');
      setIsLoading(false);
    }
  };
  
  if (isLoading && !gamepass) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Loading gamepass details...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Place Your Order</h2>
      
      {gamepass && (
        <div className="mb-6">
          <div className="flex items-center">
            <img 
              src={gamepass.imageUrl} 
              alt={gamepass.name} 
              className="w-16 h-16 object-cover rounded-md mr-4" 
            />
            <div>
              <h3 className="font-bold text-lg">{gamepass.name}</h3>
              <p className="text-gray-600 text-sm">{gamepass.description}</p>
              <p className="text-green-600 font-semibold mt-1">
                R$ {gamepass.price}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label 
            htmlFor="username" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Roblox Username
          </label>
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Roblox username"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                isValid === true
                  ? 'border-green-500 focus:ring-green-200'
                  : isValid === false
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200'
              }`}
              disabled={isLoading}
              required
            />
            {isValidating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              </div>
            )}
            {isValid === true && !isValidating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            )}
            {isValid === false && !isValidating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          <p className="mt-2 text-sm text-gray-500">
            We'll use this to verify your Gamepass purchase on Roblox.
          </p>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            className={`w-full py-3 px-4 text-white font-semibold rounded-md transition-all ${
              isValid && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              'Continue to Purchase'
            )}
          </button>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            After submitting, you'll be directed to complete your purchase
            on Roblox.
          </p>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;