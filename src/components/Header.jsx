import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  GraduationCap,
  HandCoins,
  HelpCircle,
  Home,
  ListChecks,
  Menu,
  MessageCircle,
  X,
} from 'lucide-react';
import logoImage from '../assets/logo.png';

function Header({ activeSection, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'scholarships', label: 'استكشف المنح', icon: GraduationCap },
    { id: 'services', label: 'الخدمات', icon: HandCoins },
    { id: 'how-it-works', label: 'كيف نعمل', icon: ListChecks },
    { id: 'faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
  ];

  const closeAndNavigate = (sectionId) => {
    onNavigate?.(sectionId);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', mobileMenuOpen);

    const handleEscape = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 right-0 left-0 z-[9999] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm shadow-slate-200/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.button
            type="button"
            className="flex items-center gap-2"
            onClick={() => closeAndNavigate('home')}
            whileHover={{ scale: 1.02 }}
            aria-label="العودة للرئيسية"
          >
            <img src={logoImage} alt="أمديست" className="h-12 sm:h-14 w-auto" />
          </motion.button>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => closeAndNavigate(item.id)}
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

          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => closeAndNavigate('contact')}
              className="px-6 py-3 bg-blue-600 text-white rounded-full text-base font-medium hover:bg-blue-700 transition-colors min-h-[44px] btn-primary"
            >
              تواصل معنا
            </button>
          </div>

          <button
            type="button"
            className="lg:hidden w-11 h-11 rounded-xl border border-slate-200 bg-white text-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="إغلاق القائمة"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-x-0 bottom-0 top-16 bg-slate-950/45 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed left-3 right-3 top-[76px] max-h-[calc(100dvh-92px)] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200 lg:hidden"
            >
              <div className="p-4">
                <div className="mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 p-4">
                  <p className="text-xs font-bold text-blue-700 mb-1">القائمة</p>
                  <p className="text-sm text-slate-600 leading-6">
                    انتقل بسرعة للمنح، الخدمات، أو صفحة التواصل.
                  </p>
                </div>

                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => closeAndNavigate(item.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-right transition-colors ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              isActive ? 'bg-white/15 text-white' : 'bg-blue-50 text-blue-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="text-base font-semibold">{item.label}</span>
                        </span>
                        <ArrowLeft className={`w-4 h-4 ${isActive ? 'text-white/80' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 grid gap-3">
                  <button
                    type="button"
                    onClick={() => closeAndNavigate('scholarships')}
                    className="w-full px-5 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    استعرض المنح
                    <GraduationCap className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => closeAndNavigate('contact')}
                    className="w-full px-5 py-3.5 bg-slate-100 text-slate-800 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    تواصل معنا
                    <MessageCircle className="w-5 h-5" />
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
