import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="bg-gray-800/80 rounded-2xl shadow-glow p-8 border border-primary-main/20 flex flex-col items-center">
        <AlertTriangle className="h-16 w-16 text-primary-main mb-4" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-main to-primary-light bg-clip-text text-transparent mb-2">
          Oops! Page not found
        </h1>
        <p className="text-gray-400 mb-6 text-center max-w-xs">
          Sorry, the page you are looking for does not exist or has been moved.<br />
          Go back to the homepage to continue exploring Nebula Nexus.
        </p>
        <Link to="/" className="btn-primary px-6 py-2">Back to homepage</Link>
      </div>
    </div>
  );
};

export default NotFound; 