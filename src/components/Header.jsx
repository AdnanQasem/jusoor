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
    <header className="fixed top-0 right-0 left-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors btn-primary">
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

      {/* Mobile Menu - Slides from Right */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-16 right-0 bottom-0 w-72 bg-white shadow-2xl md:hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-right px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <hr className="my-4 border-slate-200" />
              <button className="block w-full text-right px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg">
                تسجيل الدخول
              </button>
              <button className="block w-full text-right px-4 py-3 bg-blue-600 text-white rounded-lg mt-2">
                تواصل معنا
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
