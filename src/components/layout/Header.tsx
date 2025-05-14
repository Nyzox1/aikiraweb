import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-primary-main/20 shadow-glow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <Sparkles size={32} className="text-primary-main group-hover:text-primary-light transition-colors duration-300" />
            <div className="absolute inset-0 bg-primary-main/20 rounded-full blur-xl group-hover:bg-primary-light/20 transition-colors duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-main to-primary-light bg-clip-text text-transparent">
              Nebula Nexus
            </span>
            <span className="text-xs text-gray-400">Game Pass Marketplace</span>
          </div>
        </Link>
        
        <nav>
          <ul className="flex space-x-8">
            <li>
              <Link 
                to="/" 
                className="text-gray-300 hover:text-primary-light transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-main group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
            <li>
              <Link 
                to="/marketplace" 
                className="text-gray-300 hover:text-primary-light transition-colors duration-200 relative group"
              >
                Marketplace
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-main group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
            <li>
              <Link 
                to="/become-seller" 
                className="text-gray-300 hover:text-primary-light transition-colors duration-200 relative group"
              >
                Become a Seller
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-main group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
            <li>
              <Link 
                to="/admin" 
                className="text-gray-300 hover:text-primary-light transition-colors duration-200 relative group"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-main group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
            <li>
              <Link 
                to="/signin" 
                className="text-gray-300 hover:text-primary-light transition-colors duration-200 relative group"
              >
                Sign In
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-main group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
            <li>
              <Link 
                to="/signup" 
                className="text-gray-300 hover:text-primary-light transition-colors duration-200 relative group"
              >
                Sign Up
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-main group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;