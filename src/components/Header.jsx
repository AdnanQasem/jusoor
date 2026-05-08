import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logoImage from '../assets/logo.png';

function Header({ activeSection, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'scholarships', label: 'استكشف المنح' },
    { id: 'services', label: 'الخدمات' },
    { id: 'how-it-works', label: 'كيف نعمل' },
    { id: 'faq', label: 'الأسئلة الشائعة' }
  ];

  return (
    <header className="fixed top-0 right-0 left-0 z-[9999] bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Right Side in RTL */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={logoImage}
              alt="أمديست"
              className="h-14 w-auto"
            />
          </motion.div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-5 py-2.5 rounded-full text-base font-medium transition-all duration-200 min-h-[44px] ${
                  activeSection === item.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions - Left Side in RTL */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-blue-600 text-white rounded-full text-base font-medium hover:bg-blue-700 transition-colors min-h-[44px] btn-primary"
            >
              تواصل معنا
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Full screen backdrop - blocks all content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm md:hidden"
              style={{ top: '64px', zIndex: 9998 }}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-16 bottom-0 w-80 bg-white shadow-2xl md:hidden"
              style={{ zIndex: 9999 }}
            >
              <div className="p-6 space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-right px-5 py-4 rounded-xl text-base font-medium transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                <div className="pt-4 mt-4 border-t border-slate-200 space-y-3">
                  <button className="block w-full text-right px-5 py-4 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors min-h-[48px]">
                    تسجيل الدخول
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('contact');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-right px-5 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors min-h-[48px]"
                  >
                    تواصل معنا
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
