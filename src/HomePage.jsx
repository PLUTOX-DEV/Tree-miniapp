import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  TreePine,
  Zap,
  Trophy,
  Users,
  ArrowDown,
  Sparkles,
  Coins,
  TrendingUp,
  Gamepad2,
  Wallet,
  ChevronDown
} from 'lucide-react';

const HomePage = ({ onGetStarted }) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setShowScrollIndicator(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <TreePine className="w-8 h-8" />,
      title: "Grow Your Tree",
      description: "Tap to nurture your digital tree from seed to mighty oak"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Power Upgrades",
      description: "Unlock powerful upgrades and boost your growth rate"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Compete & Win",
      description: "Climb the leaderboards and claim your victory"
    },
    {
      icon: <Coins className="w-8 h-8" />,
      title: "Earn Rewards",
      description: "Daily bonuses and prestige multipliers await"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center px-4"
        style={{ y }}
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <TreePine className="w-20 h-20 text-green-400" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              TAP TO GROW
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              The Ultimate Web3 Tree Growing Adventure
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <button
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full text-lg font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center gap-3">
                <Gamepad2 className="w-5 h-5" />
                Enter the Forest
                <Wallet className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <AnimatePresence>
            {showScrollIndicator && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center text-gray-400"
                >
                  <span className="text-sm mb-2">Scroll to explore</span>
                  <ChevronDown className="w-6 h-6" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Game Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the next generation of Web3 gaming with cutting-edge mechanics and blockchain integration
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 h-full hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                  <div className="text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Join the Revolution
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Be part of the future of gaming where your progress is truly yours
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">∞</div>
                <div className="text-gray-400">Endless Growth</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">Web3</div>
                <div className="text-gray-400">True Ownership</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-400">Always Growing</div>
              </div>
            </div>

            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xl font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6" />
                Start Your Journey
                <Sparkles className="w-6 h-6" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400">
            Powered by Web3 • Built for the Future • 🌳 Tap to Grow
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;