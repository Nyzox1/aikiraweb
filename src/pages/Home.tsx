import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-main/20 to-primary-dark/20 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-main to-primary-light bg-clip-text text-transparent">
              Welcome to Nebula Nexus
      </h1>
            <p className="text-xl text-gray-300 mb-8">
              The ultimate marketplace for game passes, digital items, and more. Trade safely with our trusted community.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/marketplace" className="btn-primary flex items-center gap-2">
                Browse Marketplace
                <ArrowRight size={20} />
              </Link>
              <Link to="/become-seller" className="btn-secondary flex items-center gap-2">
                Become a Seller
                <TrendingUp size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gray-800/50 border border-primary-main/20 hover:border-primary-main/40 transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary-main/20 flex items-center justify-center mb-4">
                <Shield className="text-primary-main" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Secure Trading</h3>
              <p className="text-gray-400">Trade with confidence using our secure escrow system and verified sellers.</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/50 border border-primary-main/20 hover:border-primary-main/40 transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary-main/20 flex items-center justify-center mb-4">
                <Users className="text-primary-main" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Trusted Community</h3>
              <p className="text-gray-400">Join our community of verified traders and sellers with proven track records.</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/50 border border-primary-main/20 hover:border-primary-main/40 transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary-main/20 flex items-center justify-center mb-4">
                <TrendingUp className="text-primary-main" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Become a Seller</h3>
              <p className="text-gray-400">Start selling your game passes and digital items to our growing community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Listings Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Latest Listings</h2>
            <Link to="/marketplace" className="text-primary-main hover:text-primary-light transition-colors duration-200 flex items-center gap-2">
              View All
              <ArrowRight size={20} />
        </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Listing Cards */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-800/50 rounded-xl border border-primary-main/20 p-6 hover:border-primary-main/40 transition-colors duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Game Pass Bundle</h3>
                    <p className="text-gray-400">Premium Game Passes</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-main/20 text-primary-main text-sm">
                    500 Robux
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  Get access to exclusive game passes and premium features. Limited time offer!
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-main/20 flex items-center justify-center">
                      <Users size={16} className="text-primary-main" />
                    </div>
                    <span className="text-sm text-gray-400">Verified Seller</span>
                  </div>
                  <Link to={`/listing/${item}`} className="btn-primary">
                    View Details
        </Link>
      </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;