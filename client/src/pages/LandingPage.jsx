import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import bgImage from '../assets/bg.jpg';
import Chatbot from '../components/Chatbot';

const LandingPage = () => {
  const features = [
    {
      icon: "📊",
      title: "Stock Management",
      description: "Effortlessly track and manage your inventory with real-time updates and low stock alerts",
    },
    {
      icon: "📝",
      title: "Invoice Generation",
      description: "Create professional invoices instantly with automated calculations and send directly to customers via WhatsApp or email",
    },
    {
      icon: "💰",
      title: "Payment Tracking",
      description: "Monitor payments, dues, and generate comprehensive financial reports",
    },
    {
      icon: "📱",
      title: "Smart Dashboard",
      description: "Get insights with interactive charts and real-time business analytics",
    },
    {
      icon: "🔔",
      title: "Notifications",
      description: "Stay updated with alerts for low stock, payment dues, and important events",
    },
    {
      icon: "🎯",
      title: "Face Authentication",
      description: "Secure your account with advanced face recognition technology",
    },
    {
      icon: "🤖",
      title: "24/7 Smart Assistant",
      description: "Get instant help with our AI-powered chatbot for quick resolution of queries and guidance",
    },
    {
      icon: "📱",
      title: "Mobile Integration",
      description: "Access your business data on-the-go with our mobile-friendly interface and responsive design",
    },
    {
      icon: "🔄",
      title: "Auto Sync",
      description: "Real-time synchronization across all devices ensuring your data is always up-to-date",
    }
  ];

  const statistics = [
    { number: "1000+", label: "Active Users" },
    { number: "50,000+", label: "Invoices Generated" },
    { number: "₹10M+", label: "Transactions Processed" },
    { number: "99.9%", label: "Uptime" }
  ];

  const efficiencyMetrics = [
    {
      icon: "⚡",
      title: "Time Savings",
      metrics: [
        "60% faster invoice generation",
        "75% reduction in inventory management time",
        "Instant query resolution with AI assistant"
      ],
      highlight: "Save 20+ hours weekly"
    },
    {
      icon: "💰",
      title: "Cost Reduction",
      metrics: [
        "30% reduction in operational costs",
        "24/7 automated customer support",
        "90% decrease in manual errors"
      ],
      highlight: "Save up to ₹20,000 monthly"
    },
    {
      icon: "📈",
      title: "Business Growth",
      metrics: [
        "40% improved inventory turnover",
        "95% faster query resolution",
        "Real-time business insights"
      ],
      highlight: "Grow revenue by 35%"
    }
  ];

  const benefits = [
    {
      title: "Seamless Integration",
      description: "Connect all aspects of your business in one platform",
      icon: "🔄"
    },
    {
      title: "Real-time Analytics",
      description: "Make data-driven decisions with instant insights",
      icon: "📊"
    },
    {
      title: "Secure Platform",
      description: "Enterprise-grade security with face authentication",
      icon: "🔒"
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const scaleHover = {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  };

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="bg-gradient-to-b from-black/70 to-transparent">
        {/* Navigation */}
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <motion.div 
              className="flex items-center justify-center sm:justify-start"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img src={logo} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
              <span className="ml-2 text-xl sm:text-2xl font-bold text-white">Dhana Pathrika</span>
            </motion.div>
            <div className="flex justify-center sm:justify-end gap-3 sm:gap-4">
              <Link to="/login" className="w-full sm:w-auto">
                <motion.button 
                  className="w-full px-4 sm:px-6 py-2 text-white bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-black transition-all text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/signup" className="w-full sm:w-auto">
                <motion.button 
                  className="w-full px-4 sm:px-6 py-2 text-black bg-gray-300 rounded-full hover:bg-red-500 hover:text-white transition-all text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section - Enhanced */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 sm:px-6 pt-10 sm:pt-20 pb-20 sm:pb-40"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-red-500 text-base sm:text-lg font-semibold mb-4"
            >
              #1 Business Management Solution
            </motion.div>
            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            >
              Transform Your <motion.span
                initial={{ color: "#fff" }}
                animate={{ color: "#ef4444" }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              >Business</motion.span><br />
              Management Today
            </motion.h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              All-in-one platform for inventory management, invoicing, and business analytics.
              Join thousands of businesses already growing with Dhana Pathrika.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <motion.button
                  className="w-full px-6 sm:px-8 py-3 bg-red-600 text-white rounded-full text-base sm:text-lg font-semibold hover:bg-red-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Free Trial
                </motion.button>
              </Link>
              <motion.button
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent border-2 border-white text-white rounded-full text-base sm:text-lg font-semibold hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Statistics Section - Enhanced */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          className="bg-black/40 py-12 sm:py-20"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-red-500 mb-2">{stat.number}</div>
                  <div className="text-sm sm:text-base text-white">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <div className="py-20 bg-gradient-to-b from-black/60 to-red-900/40">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white text-center mb-16"
            >
              Why Choose Dhana Pathrika?
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid - Enhanced */}
        <div className="bg-gradient-to-b from-red-900/40 to-black/60 py-12 sm:py-20">
          <motion.div 
            className="container mx-auto px-4 sm:px-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-16"
            >
              Powerful Features for Your Business
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-white/10"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    boxShadow: "0 0 20px rgba(255,255,255,0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span 
                    className="text-4xl sm:text-5xl mb-4 sm:mb-6 block"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{feature.title}</h3>
                  <p className="text-base sm:text-lg text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Efficiency Metrics - Enhanced */}
        <motion.div 
          className="py-20 bg-gradient-to-b from-black/60 to-red-900/40"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white text-center mb-16"
            >
              Proven Results & Efficiency
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {efficiencyMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-white/10 h-full"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                >
                  <motion.div 
                    className="text-5xl sm:text-6xl mb-6"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {metric.icon}
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">{metric.title}</h3>
                  <ul className="space-y-3 mb-6">
                    {metric.metrics.map((item, i) => (
                      <li key={i} className="text-gray-300 flex items-center text-sm sm:text-base">
                        <span className="text-green-400 mr-2">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6 border-t border-white/10">
                    <p className="text-lg sm:text-xl font-bold text-red-400">{metric.highlight}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div 
          className="container mx-auto px-4 sm:px-6 py-12 sm:py-20"
          whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-red-600/20 to-red-900/20 backdrop-blur-sm rounded-2xl p-6 sm:p-12 text-center border border-red-500/20"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that trust Dhana Pathrika for their daily operations.
              Start your journey today with our 30-day free trial.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-red-600 text-white rounded-full text-base sm:text-lg font-semibold hover:bg-red-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Free Trial
                </motion.button>
              </Link>
              <motion.button
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent border-2 border-white text-white rounded-full text-base sm:text-lg font-semibold hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Footer */}
        <motion.footer 
          className="bg-black/80 py-8 sm:py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
              <div className="col-span-2 sm:col-span-1">
                <h3 className="text-white font-bold mb-3 text-lg">Product</h3>
                <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
                  <li><a href="#" className="hover:text-white block py-1">Features</a></li>
                  <li><a href="#" className="hover:text-white block py-1">Pricing</a></li>
                  <li><a href="#" className="hover:text-white block py-1">Security</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-3 text-lg">Company</h3>
                <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
                  <li><a href="#" className="hover:text-white block py-1">About Us</a></li>
                  <li><a href="#" className="hover:text-white block py-1">Careers</a></li>
                  <li><a href="#" className="hover:text-white block py-1">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-3 text-lg">Resources</h3>
                <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
                  <li><a href="#" className="hover:text-white block py-1">Blog</a></li>
                  <li><a href="#" className="hover:text-white block py-1">Documentation</a></li>
                  <li><a href="#" className="hover:text-white block py-1">Help Center</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-3 text-lg">Legal</h3>
                <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
                  <li><a href="#" className="hover:text-white block py-1">Privacy</a></li>
                  <li><a href="#" className="hover:text-white block py-1">Terms</a></li>
                  <li><a href="#" className="hover:text-white block py-1">Security</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
              <p className="text-gray-400 text-sm sm:text-base">© 2025 Dhana Pathrika. All rights reserved.</p>
            </div>
          </div>
        </motion.footer>
      </div>
      <Chatbot />
    </div>
  );
};

export default LandingPage;
