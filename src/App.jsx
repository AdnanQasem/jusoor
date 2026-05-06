import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import iiiImage from './assets/iii.png';
import logoImage from './assets/logo.png';
import {
  GraduationCap,
  Menu,
  X,
  Search,
  Check,
  Upload,
  Clock,
  FileText,
  CreditCard,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  AlertCircle,
  TrendingUp,
  Building2,
  HandCoins,
  Globe,
  MousePointerClick,
  ClipboardList,
  FileCheck,
  Rocket,
  HelpCircle,
  Sparkles,
  Shield,
  Wallet,
  FileBadge,
  Hourglass,
  RefreshCcw,
  MessageCircle,
  Star,
  Zap,
  PenTool,
  Languages,
  Package
} from 'lucide-react';

// ==========================================
// MOCK DATA - Arabic Content
// ==========================================

const SCHOLARSHIPS = [
  {
    id: 1,
    name: "منحة إيراسموس موندوس",
    nameEn: "Erasmus Mundus",
    university: "برنامج الاتحاد الأوروبي",
    deadline: "2025-02-15",
    amount: "كاملة",
    type: "ماجستير",
    fields: ["الهندسة", "العلوم", "الإدارة"],
    country: "🇪🇺",
    countryName: "أوروبا"
  },
  {
    id: 2,
    name: "منحة فولبرايت",
    nameEn: "Fulbright",
    university: "حكومة الولايات المتحدة",
    deadline: "2025-03-30",
    amount: "كاملة",
    type: "ماجستير",
    fields: ["جميع التخصصات"],
    country: "🇺🇸",
    countryName: "الولايات المتحدة"
  },
  {
    id: 3,
    name: "منح الجامعات التركية",
    nameEn: "Turkiye Burslari",
    university: "الجامعات التركية",
    deadline: "2025-06-10",
    amount: "كاملة",
    type: "بكالوريوس",
    fields: ["الطب", "الهندسة", "الآداب"],
    country: "🇹🇷",
    countryName: "تركيا"
  },
  {
    id: 4,
    name: "منحة مجلس الاتحاد الأوروبي",
    nameEn: "European Union Council",
    university: "الاتحاد الأوروبي",
    deadline: "2025-01-20",
    amount: "كاملة",
    type: "دكتوراه",
    fields: ["البحث العلمي", "التنمية"],
    country: "🇪🇺",
    countryName: "أوروبا"
  }
];

const SERVICES = [
  {
    id: 1,
    name: "الباقة الذهبية",
    nameEn: "Gold Package",
    price: 70,
    description: "الحزمة الشاملة لكل ما تحتاجه للتقديم على المنح",
    features: [
      "مراجعة احترافية للسيرة الذاتية",
      "كتابة رسالة تحفيز مخصصة",
      "ترجمة معتمدة للوثائق",
      "متابعة مستمرة للطلب",
      "دعم فني على مدار الساعة",
      "استشارة مجانية مع خبير"
    ],
    tier: "gold",
    icon: Package,
    gradient: "from-yellow-400 via-amber-500 to-yellow-600",
    bgGradient: "from-yellow-50/80 via-amber-50/50 to-white",
    borderColor: "border-yellow-400",
    shadowColor: "shadow-yellow-200/50",
    buttonGradient: "from-yellow-500 to-amber-600",
    hoverShadow: "hover:shadow-yellow-300/60",
    accentColor: "#f59e0b"
  },
  {
    id: 2,
    name: "الباقة الفضية",
    nameEn: "Silver Package",
    price: 40,
    description: "خدمات أساسية متكاملة لتقديم احترافي",
    features: [
      "تصميم سيرة ذاتية احترافية",
      "كتابة رسالة تحفيز",
      "مراجعة لغوية شاملة",
      "تنسيق PDF جاهز",
      "تعديل مجاني مرة واحدة"
    ],
    tier: "silver",
    icon: Zap,
    gradient: "from-gray-300 via-slate-400 to-gray-500",
    bgGradient: "from-gray-50/80 via-slate-50/50 to-white",
    borderColor: "border-gray-300",
    shadowColor: "shadow-gray-200/50",
    buttonGradient: "from-gray-600 to-slate-700",
    hoverShadow: "hover:shadow-gray-300/60",
    accentColor: "#6b7280"
  },
  {
    id: 3,
    name: "الباقة البرونزية",
    nameEn: "Bronze Package",
    price: 20,
    description: "خدمة متخصصة لرسالة التحفيز فقط",
    features: [
      "كتابة رسالة تحفيز مقنعة",
      "تخصيص حسب المنحة",
      "مراجعة لغوية",
      "تعديلات حتى الرضا"
    ],
    tier: "bronze",
    icon: PenTool,
    gradient: "from-amber-600 via-orange-600 to-amber-700",
    bgGradient: "from-amber-50/80 via-orange-50/50 to-white",
    borderColor: "border-amber-400",
    shadowColor: "shadow-amber-200/50",
    buttonGradient: "from-amber-600 to-orange-700",
    hoverShadow: "hover:shadow-amber-300/60",
    accentColor: "#d97706"
  }
];

const FAQS = [
  {
    id: 1,
    question: "ما هي منصة أمديست؟",
    answer: "أمديست هي منصة متخصصة تهدف إلى مساعدة طلاب فلسطين في غزة على الحصول على منح دراسية دولية. نقدم خدمات متكاملة تشمل البحث عن المنح، إعداد الأوراق، ومتابعة الطلبات حتى القبول.",
    icon: Sparkles
  },
  {
    id: 2,
    question: "هل يجب الدفع قبل رؤية المنح؟",
    answer: "لا، قائمة المنح متاحة للجميع مجاناً. الدفع مطلوب فقط عند طلب خدمات التقديم الشاملة أو خدمات إعداد الأوراق.",
    icon: Wallet
  },
  {
    id: 3,
    question: "كيف يعمل نظام PalPay؟",
    answer: "PalPay هو نظام دفع فلسطيني آمن. يمكنك تحويل المبلغ عبر تطبيق PalPay إلى رقم الهاتف المحدد، ثم إرفاق إيصال الدفع في استمارة الطلب.",
    icon: Shield
  },
  {
    id: 4,
    question: "ما الوثائق المطلوبة للتقديم؟",
    answer: "الوثائق الأساسية تشمل: جواز السفر، شهادة الثانوية العامة، كشف علامات الجامعة (للماجستير)، شهادة اللغة (إن وجدت)، CV، ورسالة تحفيز.",
    icon: FileBadge
  },
  {
    id: 5,
    question: "كم يستغرق عمل السيرة الذاتية؟",
    answer: "نقدم السيرة الذاتية خلال 24-48 ساعة من استلام الطلب والدفع. الخدمة السريعة متوفرة عند الطلب.",
    icon: Hourglass
  },
  {
    id: 6,
    question: "هل يمكن استرداد المال إذا أغلقت المنحة؟",
    answer: "نعم، في حال إغلاق المنحة قبل تقديم طلبك، يمكنك استرداد المبلغ كاملاً أو تحويله لمنحة أخرى حسب رغبتك.",
    icon: RefreshCcw
  }
];

const STEPS = [
  {
    id: 1,
    title: "اختر الخدمة وادفع",
    description: "اختر الخدمة المناسبة وادفع بسهولة عبر PalPay",
    icon: MousePointerClick
  },
  {
    id: 2,
    title: "املأ استمارة التقديم",
    description: "أكمل بياناتك في الاستمارة بخطوات بسيطة",
    icon: ClipboardList
  },
  {
    id: 3,
    title: "نحن نجهز ملفك",
    description: "فريقنا المتخصص يعمل على إعداد ملفاتك خلال 48-72 ساعة",
    icon: FileCheck
  },
  {
    id: 4,
    title: "تقديم ومتابعة",
    description: "تتبع حالة طلبك واحصل على القبول",
    icon: Rocket
  }
];

// ==========================================
// COMPONENTS
// ==========================================

// Header Component
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeSection === item.id
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
                  className={`block w-full text-right px-4 py-3 rounded-lg text-base font-medium transition-colors ${activeSection === item.id
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

function AnimatedCounter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const numericTarget = parseInt(target);
    if (isNaN(numericTarget)) {
      setCount(target);
      return;
    }
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericTarget));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(numericTarget);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  const displayValue = typeof count === 'number' && !isNaN(parseInt(target))
    ? `${count}${suffix}`
    : target;

  return <span ref={ref}>{displayValue}</span>;
}

function Hero({ onNavigate }) {
  const stats = [
    { number: 30, suffix: "+", label: "منحة نشطة", icon: GraduationCap },
    { number: 2000, suffix: "+", label: "طالب مساعد", icon: TrendingUp },
    { number: 48, suffix: "h", label: "وقت المعالجة", icon: Clock },
    { number: 50, suffix: "+", label: "جامعة شريكة", icon: Building2 },
  ];

  return (
    <section id="home" className="min-h-screen flex flex-col bg-white overflow-hidden">
      <div className="flex-1 flex items-center pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-right">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.2] mb-3 font-serif"
                  >
                    فرصتك للدراسة
                  </motion.h1>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mb-2"
                  >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-700 font-serif">
                      تبدأ من هنا
                    </h2>
                  </motion.div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-base md:text-lg text-slate-500 mb-8 leading-relaxed max-w-lg"
                >
                  منصة أمديست تجمع آخر المنح الدراسية المتاحة لطلاب غزة.
                  نحن نتولى أوراقك، وأنت ركّز على حلمك.
                  انضم لأكثر من ٢٠٠٠ طالب تم مساعدتهم في تحقيق حلم الدراسة بالخارج.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate('scholarships')}
                    className="relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white rounded-xl text-lg font-bold hover:from-blue-700 hover:via-blue-800 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 btn-glow btn-shimmer overflow-hidden"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="relative z-10"
                    >
                      استعرض المنح الآن
                    </motion.span>
                    <motion.span
                      animate={{ 
                        x: [0, -5, 0],
                        rotate: [0, -10, 0]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-5 h-5 relative z-10"
                    >
                      <ArrowLeft className="w-full h-full" />
                    </motion.span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('services')}
                    className="px-7 py-3.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-base font-bold hover:border-slate-400 hover:bg-slate-50 transition-colors"
                  >
                    خدماتنا وأسعارنا
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={iiiImage}
                    alt="Students"
                    className="w-full h-80 lg:h-[420px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="group relative bg-white rounded-2xl p-5 shadow-lg shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-200/60 transition-all duration-300 border border-blue-50"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <motion.div 
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 shadow-sm"
                    >
                      <Icon className="w-7 h-7 text-blue-700 group-hover:text-blue-800 transition-colors" />
                    </motion.div>
                    <div>
                      <p className="text-2xl md:text-3xl font-black text-slate-900 mb-1">
                        <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                      </p>
                      <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                    </div>
                  </div>
                  
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/5 group-hover:to-blue-600/5 transition-all duration-500 pointer-events-none" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}



// Services Section
function ServicesSection({ onSelectService }) {
  return (
    <section id="services" className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-sm font-bold mb-6 shadow-lg shadow-amber-300/50"
            >
              <Star className="w-4 h-4 fill-current" />
              خدماتنا
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-5 font-serif">
              اختر الباقة <span className="gradient-text-gold">المناسبة لك</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              باقات متنوعة تلبي احتياجاتك، من البرونزية إلى الذهبية
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const isGold = service.tier === 'gold';
            const isSilver = service.tier === 'silver';
            const isBronze = service.tier === 'bronze';
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className={`relative group rounded-3xl overflow-hidden transition-all duration-300 ${
                  isGold 
                    ? 'shadow-2xl shadow-amber-200/60 border-2 border-amber-400 scale-105 z-10' 
                    : 'shadow-xl border border-slate-200'
                }`}
              >
                {/* Tier Badge */}
                <div className={`absolute top-4 right-4 z-10 px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
                  isGold 
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white' 
                    : isSilver
                    ? 'bg-gradient-to-r from-slate-300 to-slate-400 text-white'
                    : 'bg-gradient-to-r from-orange-400 to-amber-600 text-white'
                }`}>
                  {isGold && '🥇 ذهبية'}
                  {isSilver && '🥈 فضية'}
                  {isBronze && '🥉 برونزية'}
                </div>

                {/* Icon Header */}
                <div className={`relative h-40 bg-gradient-to-br ${service.gradient} p-6`}>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                  
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white rounded-full" />
                  </div>

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
                    className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl"
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  {/* Shine Effect */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                </div>

                {/* Content */}
                <div className={`p-6 bg-gradient-to-b ${service.bgGradient}`}>
                  {/* Title */}
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{service.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{service.nameEn}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-baseline gap-1">
                      <span className={`text-5xl font-black bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                        {service.price}
                      </span>
                      <span className="text-slate-500 text-xl font-bold">₪</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-center text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-right">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isGold ? 'bg-amber-100' : isSilver ? 'bg-slate-100' : 'bg-orange-100'
                        }`}>
                          <Check className={`w-3 h-3 ${
                            isGold ? 'text-amber-600' : isSilver ? 'text-slate-600' : 'text-orange-600'
                          }`} />
                        </div>
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectService(service)}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r ${service.buttonGradient} hover:shadow-xl hover:scale-105`}
                  >
                    اطلب {service.name} الآن
                  </motion.button>
                </div>

                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
              </motion.div>
            );
          })}
        </div>

        {/* Guarantee Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg shadow-green-100/50">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="font-bold text-green-800 text-lg">ضمان الجودة والثقة</p>
              <p className="text-sm text-green-600">نضمن لك جودة عالية أو استرداد أموالك بالكامل</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Scholarships Section
function ScholarshipsSection() {
  const [filter, setFilter] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  const filters = ['الكل', 'البكالوريوس', 'الماجستير', 'الدكتوراه'];

  const filteredScholarships = SCHOLARSHIPS.filter(s => {
    const matchesFilter = filter === 'الكل' || s.type === filter;
    const matchesSearch = s.name.includes(searchQuery) || s.university.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days) => {
    if (days < 7) return 'from-red-500 to-orange-500';
    if (days < 30) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };

  return (
    <section id="scholarships" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-5 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm font-bold mb-5 shadow-sm"
            >
              المنح المتاحة
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold text-slate-900 mb-5 font-serif"
            >
              استكشف <span className="gradient-text-blue">فرصك الدراسية</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed"
            >
              قائمة محدثة بأحدث المنح الدراسية المتاحة للطلاب الفلسطينيين
            </motion.p>
            
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto mt-6"
            />
          </motion.div>
        </div>

        {/* Filters & Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-4 mb-12"
        >
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {filters.map((f, index) => (
              <motion.button
                key={f}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 overflow-hidden ${
                  filter === f
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-300/50'
                    : 'bg-white text-slate-600 hover:text-blue-700 shadow-md hover:shadow-lg border border-slate-200'
                }`}
              >
                {filter === f && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse" />
                )}
                <span className="relative z-10">{f}</span>
              </motion.button>
            ))}
          </div>

          {/* Search Bar */}
          <motion.div 
            className="relative flex-1 max-w-md mx-auto md:mx-0"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400">
              <Search />
            </div>
            <input
              type="text"
              placeholder="ابحث عن منحة أو جامعة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 shadow-md hover:shadow-lg"
            />
          </motion.div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mb-6 text-center md:text-right"
        >
          <p className="text-slate-600">
            تم العثور على <span className="font-bold text-blue-700">{filteredScholarships.length}</span> منحة
          </p>
        </motion.div>

        {/* Scholarships Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship, index) => {
            const daysLeft = getDaysLeft(scholarship.deadline);

            return (
              <motion.div
                key={scholarship.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    {/* Country Flag as Icon */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-4xl flex-shrink-0 shadow-sm">
                      {scholarship.country}
                    </div>

                    <div className="flex-1">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {scholarship.name}
                      </h3>
                      <p className="text-sm text-slate-500">{scholarship.nameEn}</p>
                    </div>

                    {/* Deadline Badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className={`text-sm font-bold ${
                        daysLeft < 7 ? 'text-red-600' : daysLeft < 30 ? 'text-orange-600' : 'text-slate-700'
                      }`}>
                        {daysLeft} يوم
                      </span>
                    </div>
                  </div>

                  {/* University */}
                  <p className="text-sm text-slate-600 mt-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    {scholarship.university}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-5 bg-slate-50/50">
                  {/* Tags Row */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                      {scholarship.type}
                    </span>
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                      {scholarship.amount}
                    </span>
                  </div>

                  {/* Fields */}
                  <div className="flex flex-wrap gap-2">
                    {scholarship.fields.slice(0, 3).map((field, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-xs">
                        {field}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>قدّم الآن</span>
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredScholarships.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد نتائج</h3>
            <p className="text-slate-600">جرب تغيير معايير البحث أو الفلتر</p>
          </motion.div>
        )}

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-700 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            عرض جميع المنح
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-5 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm font-bold mb-5 shadow-sm"
            >
              كيف نعمل
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold text-slate-900 mb-5 font-serif"
            >
              رحلتك نحو القبول في <span className="gradient-text-blue">٤ خطوات</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed"
            >
              نبسط لك عملية التقديم على المنح بخطوات واضحة وسهلة
            </motion.p>
            
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto mt-6"
            />
          </motion.div>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-300/40 group-hover:shadow-blue-400/60 transition-shadow duration-300">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div className="w-20 h-20 mb-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                    <Icon className="w-10 h-10 text-blue-600 group-hover:text-blue-700 group-hover:scale-110 transition-all duration-300" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow indicator on hover */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute bottom-6 left-6 text-blue-600"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-300/50 hover:shadow-blue-400/70 transition-all duration-300 cursor-pointer"
          >
            <span>ابدأ رحلتك الآن</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Payment Modal Component
function PaymentModal({ service, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    transactionId: '',
    phone: '',
    receipt: null
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setFormData({ ...formData, receipt: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process payment
    alert('تم استلام طلبك بنجاح! سنتواصل معك قريباً.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">إتمام الطلب</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div>
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">{service.name}</span>
                  <span className="font-bold">{service.price} ₪</span>
                </div>
                <p className="text-sm text-slate-500">{service.description}</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-900">ادفع عبر PalPay</p>
                    <p className="text-sm text-green-700">
                      أرسل المبلغ إلى: <span className="font-bold">059-123-4567</span>
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
              >
                لقد قمت بالدفع - التالي
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  رقم العملية (Transaction ID)
                </label>
                <input
                  type="text"
                  required
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  placeholder="أدخل رقم العملية من PalPay"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  رقم الهاتف للتواصل
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="059-xxxxxxx"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  إيصال الدفع
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={`upload-zone border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
                    }`}
                >
                  {formData.receipt ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span>تم اختيار الملف: {formData.receipt.name}</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 mb-1">اسحب الملف هنا أو تصفح</p>
                      <p className="text-sm text-slate-400">PNG, JPG حتى ٥ ميجا</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-slate-300 rounded-xl font-medium"
                >
                  السابق
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                >
                  تأكيد الطلب
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// FAQ Section
function FAQSection() {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-white via-blue-50/50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-sm font-bold mb-6 shadow-lg shadow-blue-300/50"
            >
              <HelpCircle className="w-4 h-4" />
              الأسئلة الشائعة
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-5 font-serif">
              كل ما تريد معرفته عن <span className="gradient-text-blue">أمديست</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              إذا لم تجد إجابة سؤالك، لا تتردد في التواصل معنا
            </p>
          </motion.div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openId === faq.id;
            
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`group bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? 'border-blue-300 shadow-xl shadow-blue-100/50' 
                      : 'border-slate-100 hover:border-blue-200 hover:shadow-lg'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 md:p-6 flex items-center gap-4 text-right"
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-300/50' 
                        : 'bg-gradient-to-br from-slate-100 to-slate-50 text-slate-500 group-hover:from-blue-100 group-hover:to-blue-50 group-hover:text-blue-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Question */}
                    <span className={`flex-1 font-bold text-right text-lg ${
                      isOpen ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-700'
                    }`}>
                      {faq.question}
                    </span>

                    {/* Chevron */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isOpen 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pr-[4.5rem]">
                          <div className="h-px bg-gradient-to-r from-blue-200 via-blue-100 to-transparent mb-4" />
                          <p className="text-slate-600 leading-relaxed text-right">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Partners Section
function PartnersSection() {
  const partners = [
    { name: "وزارة التعليم", icon: Building2 },
    { name: "جامعة القدس", icon: GraduationCap },
    { name: "UNRWA", icon: Globe },
    { name: "الهيئة الخيرية", icon: HandCoins },
    { name: "التعليم العالي", icon: Building2 },
    { name: "جامعة الأزهر", icon: GraduationCap }
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h3 className="text-lg font-medium text-slate-600">شركاؤنا في النجاح</h3>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex animate-marquee-rtl">
            {[...partners, ...partners].map((partner, index) => {
              const Icon = partner.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 mx-12 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Icon className="w-8 h-8" />
                  <span className="text-lg font-medium whitespace-nowrap">{partner.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Direct Admissions Section
function DirectAdmissionsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-right">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-blue-300 font-medium mb-4 block">القبول المباشر</span>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
                الجامعات تتنافس عليك.
                <span className="block text-blue-300">نعم، هذا حقيقي.</span>
              </h2>

              <p className="text-slate-300 mb-8 leading-relaxed">
                أكمل ملفك الشخصي واحصل على عروض قبول مباشرة من عدة جامعات عالمية
                تبحث عن طلاب متميزين مثلك. لا حاجة للبحث، الجامعات ستأتي إليك.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 border-2 border-white text-white rounded-full text-lg font-medium hover:bg-white hover:text-slate-900 transition-colors flex items-center gap-2"
              >
                احصل على عروض القبول
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop"
                alt="University Campus"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  const socialLinks = [
    { name: 'فيسبوك', icon: 'f', href: '#' },
    { name: 'تويتر', icon: '𝕏', href: '#' },
    { name: 'انستغرام', icon: '📷', href: '#' },
    { name: 'لينكدإن', icon: 'in', href: '#' }
  ];

  const quickLinks = [
    { label: 'الرئيسية', href: '#home' },
    { label: 'المنح', href: '#scholarships' },
    { label: 'الخدمات', href: '#services' },
    { label: 'كيف نعمل', href: '#how-it-works' },
    { label: 'الأسئلة الشائعة', href: '#faq' }
  ];

  const services = [
    { label: 'التقديم الشامل', href: '#services' },
    { label: 'السيرة الذاتية', href: '#services' },
    { label: 'رسالة التحفيز', href: '#services' },
    { label: 'الترجمة', href: '#services' },
    { label: 'المتابعة', href: '#services' }
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold block">أمديست</span>
                <span className="text-xs text-slate-400">بوابتك للمستقبل</span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              منصة متخصصة في مساعدة طلاب فلسطين في غزة على الحصول على منح دراسية دولية.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30"
                  title={social.name}
                >
                  <span className="text-sm font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></span>
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-blue-500 transition-colors"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></span>
              الخدمات
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <a 
                    href={service.href} 
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-blue-500 transition-colors"></span>
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></span>
              تواصل معنا
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors">+970 59-123-4567</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors">info@amdist.ps</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors">غزة، فلسطين</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              جميع الحقوق محفوظة © ٢٠٢٥ أمديست - منصة المنح الدراسية
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// MAIN APP
// ==========================================

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedService, setSelectedService] = useState(null);

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'scholarships', 'services', 'how-it-works', 'faq'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div dir="rtl" lang="ar" className="min-h-screen">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main>
        <Hero onNavigate={handleNavigate} />
        <ScholarshipsSection />
        <ServicesSection onSelectService={setSelectedService} />
        <HowItWorksSection />
        <FAQSection />
        <PartnersSection />
        <DirectAdmissionsSection />
      </main>

      <Footer />

      {/* WhatsApp Floating Button */}
      <motion.a
        href="https://wa.me/970599999999"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 group"
      >
        {/* Pulse Effect */}
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
        
        {/* Button */}
        <div className="relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 overflow-hidden">
          {/* Background Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          {/* Icon */}
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <MessageCircle className="w-5 h-5" />
          </div>
          
          {/* Text */}
          <div className="flex flex-col">
            <span className="font-bold text-sm whitespace-nowrap">تواصل معنا</span>
            <span className="text-xs text-green-100 whitespace-nowrap">عبر واتساب</span>
          </div>
        </div>
      </motion.a>

      <AnimatePresence>
        {selectedService && (
          <PaymentModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
