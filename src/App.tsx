import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import BecomeSeller from './pages/BecomeSeller';
import AdminDashboard from './components/admin/AdminDashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { startMonitoringService } from './services/monitoringService';

function App() {
  // Start the monitoring service when the app loads
  useEffect(() => {
    startMonitoringService();
    
    // Clean up the monitoring service when the app is closed
    return () => {
      // This is a browser environment, so the app might be closed without this
      // cleanup being called. In a real app, you'd want to handle this more robustly.
      // But for this example, we'll include it for proper practice.
      try {
        // Import is used here to avoid circular dependencies
        import('./services/monitoringService').then(({ stopMonitoringService }) => {
          stopMonitoringService();
        });
      } catch (error) {
        console.error('Error stopping monitoring service:', error);
      }
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-900">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/become-seller" element={<BecomeSeller />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;