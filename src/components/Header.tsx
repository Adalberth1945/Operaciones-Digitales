import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Menu, X, ChevronRight, Circle, Sparkles, Zap, Phone, Mail, ExternalLink, Copy, Check } from 'lucide-react';
import RobotAnimation from './RobotAnimation';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const contactBtnRef = useRef<HTMLButtonElement>(null);

  const contactInfo = {
    phone: '+56 9 48597114',
    email: 'contacto@digitaloperations.cl'
  };

  const copyToClipboard = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isContactOpen && 
        contactBtnRef.current && 
        !contactBtnRef.current.contains(event.target as Node) &&
        event.target instanceof Node &&
        !event.target.closest('.contact-popup')
      ) {
        setIsContactOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isContactOpen]);

  const handleMobileMenuClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    handleNavLinkClick(href);
  };

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-400 mr-2" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Operaciones Digitales
                </h1>
                <p className="text-xs tracking-wider text-gray-400">SpA</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {['Servicios', 'Nosotros', 'Testimonios', 'Contacto'].map((item) => (
              <motion.button
                key={item}
                onClick={() => handleNavLinkClick(`#${item.toLowerCase()}`)}
                className="text-gray-300 hover:text-white transition-colors relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </motion.button>
            ))}
            
            {/* Contact Button with Popup */}
            <div className="relative">
              <motion.button
                ref={contactBtnRef}
                onClick={() => setIsContactOpen(!isContactOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
              >
                Contáctanos
              </motion.button>

              <AnimatePresence>
                {isContactOpen && (
                  <motion.div 
                    className="contact-popup absolute right-0 mt-2 w-72 rounded-xl overflow-hidden z-50"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-xl"></div>
                    
                    <div className="relative p-4">
                      <div className="text-center mb-2">
                        <h4 className="text-white font-semibold">Contacto Directo</h4>
                        <p className="text-gray-300 text-sm">Selecciona una opción</p>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Phone Option */}
                        <motion.div
                          className="relative group"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="bg-gray-800/70 rounded-lg p-3 border border-gray-700 hover:border-cyan-600/50 relative group-hover:translate-y-[-2px] transition-all">
                            <div className="flex items-center">
                              <div className="p-2 rounded-full bg-cyan-500/20 mr-3">
                                <Phone className="w-5 h-5 text-cyan-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-200 text-sm font-medium">Llamar</p>
                                <p className="text-cyan-400 text-sm">{contactInfo.phone}</p>
                              </div>
                              <div className="flex space-x-1">
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => copyToClipboard(contactInfo.phone, 'phone')}
                                  className="p-1.5 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                                >
                                  {copiedText === 'phone' ? (
                                    <Check className="w-3.5 h-3.5 text-green-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-gray-300" />
                                  )}
                                </motion.button>
                                <motion.a
                                  href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full hover:from-cyan-500 hover:to-blue-500 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                                </motion.a>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Email Option */}
                        <motion.div
                          className="relative group"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="bg-gray-800/70 rounded-lg p-3 border border-gray-700 hover:border-purple-600/50 relative group-hover:translate-y-[-2px] transition-all">
                            <div className="flex items-center">
                              <div className="p-2 rounded-full bg-purple-500/20 mr-3">
                                <Mail className="w-5 h-5 text-purple-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-200 text-sm font-medium">Email</p>
                                <p className="text-purple-400 text-sm truncate">{contactInfo.email}</p>
                              </div>
                              <div className="flex space-x-1">
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => copyToClipboard(contactInfo.email, 'email')}
                                  className="p-1.5 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                                >
                                  {copiedText === 'email' ? (
                                    <Check className="w-3.5 h-3.5 text-green-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-gray-300" />
                                  )}
                                </motion.button>
                                <motion.a
                                  href={`mailto:${contactInfo.email}`}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                                </motion.a>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              {['Servicios', 'Nosotros', 'Testimonios', 'Contacto'].map((item) => (
                <motion.button
                  key={item}
                  onClick={(e) => handleMobileMenuClick(e, `#${item.toLowerCase()}`)}
                  className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
                  whileTap={{ scale: 0.98 }}
                >
                  {item}
                </motion.button>
              ))}
              
              {/* Mobile Contact Options */}
              <div className="pt-4 space-y-3">
                <div className="text-sm text-gray-400 px-4">Contacto Directo:</div>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                  className="flex items-center px-4 py-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <Phone className="w-5 h-5 text-cyan-400 mr-3" />
                  <span className="text-gray-300">{contactInfo.phone}</span>
                </a>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center px-4 py-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <Mail className="w-5 h-5 text-purple-400 mr-3" />
                  <span className="text-gray-300">{contactInfo.email}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;