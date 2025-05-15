import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Key, BarChart3, Cloud } from 'lucide-react';

const features = [
  {
    name: 'Secure Trading',
    description: 'Trade game passes safely with our secure escrow system and verified sellers.',
    icon: Shield,
  },
  {
    name: 'Key Management',
    description: 'Generate and manage access keys for your game passes with ease.',
    icon: Key,
  },
  {
    name: 'Usage Analytics',
    description: 'Track your sales and monitor game pass usage in real-time.',
    icon: BarChart3,
  },
  {
    name: 'Cloud Storage',
    description: 'Store your game passes securely in our cloud infrastructure.',
    icon: Cloud,
  },
];

const testimonials = [
  {
    content: "The GamePass Store has made selling my game passes so much easier. The platform is secure and user-friendly!",
    author: "Alex Johnson",
    role: "Game Developer",
    imageUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
  {
    content: "As a buyer, I love how safe and straightforward the trading process is. The key delivery is instant!",
    author: "Sarah Chen",
    role: "Roblox Player",
    imageUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-main/20 to-primary-dark/20 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-main to-primary-light bg-clip-text text-transparent">
              The Ultimate GamePass Marketplace
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Buy and sell Roblox game passes securely. Our platform ensures safe trading
              and instant delivery for all your gaming needs.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/marketplace" className="btn-primary px-6 py-3">
                Browse Marketplace
              </Link>
              <Link to="/become-seller" className="btn-secondary px-6 py-3">
                Become a Seller
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-gray-800/50 border border-primary-main/20 hover:border-primary-main/40 transition-colors duration-300"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary-main/20 flex items-center justify-center mb-4">
                  <feature.icon className="text-primary-main" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.name}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 rounded-xl border border-primary-main/20 p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="text-white font-semibold">{testimonial.author}</p>
                    <p className="text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-primary-main/20 to-primary-dark/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of game pass traders and start buying or selling today.
            Experience secure trading and instant delivery.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="btn-primary px-8 py-3">
              Create Account
            </Link>
            <Link to="/marketplace" className="btn-secondary px-8 py-3">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;