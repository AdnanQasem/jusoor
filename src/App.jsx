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
  Globe
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
    logo: "🏛️",
    urgent: false
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
    logo: "🇺🇸",
    urgent: false
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
    logo: "🇹🇷",
    urgent: false
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
    logo: "🇪🇺",
    urgent: true
  }
];

const SERVICES = [
  {
    id: 1,
    name: "خدمة التقديم الشامل",
    price: 70,
    description: "الحزمة الكاملة: مراجعة السيرة الذاتية، كتابة رسالة التحفيز، ترجمة الوثائق، ومتابعة الطلب حتى القبول",
    features: [
      "مراجعة احترافية للسيرة الذاتية",
      "كتابة رسالة تحفيز مخصصة",
      "ترجمة معتمدة للوثائق",
      "متابعة مستمرة للطلب",
      "دعم فني على مدار الساعة"
    ],
    popular: true
  },
  {
    id: 2,
    name: "تصميم السيرة الذاتية",
    price: 15,
    description: "CV احترافي متوافق مع أنظمة الترشيح الآلية (ATS) مخصص للمنح الدولية",
    features: [
      "تصميم احترافي حديث",
      "توافق كامل مع ATS",
      "نسق PDF وجاهز للطباعة",
      "مراجعة وتعديل مجاني"
    ],
    popular: false
  },
  {
    id: 3,
    name: "كتابة رسالة التحفيز",
    price: 20,
    description: "رسالة تحفيز مقنعة تبرز نقاط قوتك ودوافعك بأسلوب احترافي",
    features: [
      "أسلوب مقنع ومؤثر",
      "تخصيص حسب المنحة",
      "مراجعة لغوية شاملة",
      "تعديلات حتى الرضا"
    ],
    popular: false
  }
];

const FAQS = [
  {
    id: 1,
    question: "ما هي منصة أمديست؟",
    answer: "أمديست هي منصة متخصصة تهدف إلى مساعدة طلاب فلسطين في غزة على الحصول على منح دراسية دولية. نقدم خدمات متكاملة تشمل البحث عن المنح، إعداد الأوراق، ومتابعة الطلبات حتى القبول."
  },
  {
    id: 2,
    question: "هل يجب الدفع قبل رؤية المنح؟",
    answer: "لا، قائمة المنح متاحة للجميع مجاناً. الدفع مطلوب فقط عند طلب خدمات التقديم الشاملة أو خدمات إعداد الأوراق."
  },
  {
    id: 3,
    question: "كيف يعمل نظام PalPay؟",
    answer: "PalPay هو نظام دفع فلسطيني آمن. يمكنك تحويل المبلغ عبر تطبيق PalPay إلى رقم الهاتف المحدد، ثم إرفاق إيصال الدفع في استمارة الطلب."
  },
  {
    id: 4,
    question: "ما الوثائق المطلوبة للتقديم؟",
    answer: "الوثائق الأساسية تشمل: جواز السفر، شهادة الثانوية العامة، كشف علامات الجامعة (للماجستير)، شهادة اللغة (إن وجدت)، CV، ورسالة تحفيز."
  },
  {
    id: 5,
    question: "كم يستغرق عمل السيرة الذاتية؟",
    answer: "نقدم السيرة الذاتية خلال 24-48 ساعة من استلام الطلب والدفع. الخدمة السريعة متوفرة عند الطلب."
  },
  {
    id: 6,
    question: "هل يمكن استرداد المال إذا أغلقت المنحة؟",
    answer: "نعم، في حال إغلاق المنحة قبل تقديم طلبك، يمكنك استرداد المبلغ كاملاً أو تحويله لمنحة أخرى حسب رغبتك."
  }
];

const STEPS = [
  {
    id: 1,
    title: "اختر الخدمة وادفع",
    description: "اختر الخدمة المناسبة وادفع عبر PalPay",
    icon: CreditCard
  },
  {
    id: 2,
    title: "املأ استمارة التقديم",
    description: "أكمل البيانات المطلوبة في الاستمارة",
    icon: FileText
  },
  {
    id: 3,
    title: "نحن نجهز ملفك",
    description: "فريقنا يعمل على إعداد أوراقك خلال 48-72 ساعة",
    icon: Clock
  },
  {
    id: 4,
    title: "تقديم ومتابعة",
    description: "تتبع حالة طلبك عبر لوحة التحكم الخاصة بك",
    icon: TrendingUp
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
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-4">
              خدماتنا
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
              باقات متكاملة لتحقيق حلمك
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              اختر الخدمة التي تناسب احتياجاتك، وفريقنا المتخصص سيتولى إعداد أوراقك باحترافية
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 card-hover ${service.popular ? 'border-blue-600 shadow-xl' : 'border-slate-100 hover:border-blue-300'
                }`}
            >
              {service.popular && (
                <div className="absolute -top-3 right-1/2 translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  الأكثر طلباً
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-slate-900">{service.price}</span>
                  <span className="text-slate-500">₪</span>
                </div>
              </div>

              <p className="text-slate-600 text-center mb-6 text-sm leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-right">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectService(service)}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${service.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                اطلب الخدمة
              </motion.button>
            </motion.div>
          ))}
        </div>
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
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {filteredScholarships.map((scholarship, index) => {
            const daysLeft = getDaysLeft(scholarship.deadline);
            const isUrgent = scholarship.urgent || daysLeft < 30;

            return (
              <motion.div
                key={scholarship.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                onMouseEnter={() => setHoveredCard(scholarship.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 border border-slate-100"
              >
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-50/50 group-hover:from-blue-50/50 group-hover:via-blue-50/30 group-hover:to-blue-50/100 transition-all duration-500" />
                
                {/* Urgent Badge */}
                {isUrgent && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    className="absolute top-4 left-4 z-20"
                  >
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg shadow-red-300/50">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>عاجل</span>
                    </div>
                  </motion.div>
                )}

                {/* Top Decoration */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-6 lg:p-7">
                  <div className="flex items-start gap-5">
                    {/* Logo with Animation */}
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.1, rotate: 12 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl shadow-md group-hover:shadow-lg transition-shadow duration-300 flex-shrink-0"
                    >
                      {scholarship.logo}
                    </motion.div>

                    <div className="flex-1 text-right">
                      {/* Title */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">
                          {scholarship.name}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">{scholarship.nameEn}</p>
                      </motion.div>

                      {/* University */}
                      <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="text-slate-600 mt-3 text-sm flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-blue-500" />
                        {scholarship.university}
                      </motion.p>

                      {/* Tags */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="flex flex-wrap gap-2 mt-4"
                      >
                        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-300/50">
                          {scholarship.type}
                        </span>
                        <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-xs font-bold shadow-md shadow-green-300/50">
                          {scholarship.amount}
                        </span>
                        {scholarship.fields.slice(0, 2).map((field, i) => (
                          <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200">
                            {field}
                          </span>
                        ))}
                      </motion.div>

                      {/* Footer */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100"
                      >
                        {/* Deadline */}
                        <motion.div 
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                            daysLeft < 7 
                              ? 'bg-red-50 text-red-700' 
                              : daysLeft < 30 
                              ? 'bg-yellow-50 text-yellow-700'
                              : 'bg-slate-50 text-slate-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Clock className="w-4 h-4" />
                          </motion.div>
                          <span className="text-sm font-bold">
                            {daysLeft > 0 ? `${daysLeft} يوم` : 'منتهي'}
                          </span>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.button
                          whileHover={{ scale: 1.05, x: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-300/50 hover:shadow-blue-400/70 transition-all duration-300 flex items-center gap-2 group/btn"
                        >
                          <span>تقديم</span>
                          <motion.span
                            animate={{ x: [0, -3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </motion.span>
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ filter: 'blur(20px)' }} />
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
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 opacity-30" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.15, duration: 0.6, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative group"
                >
                  {/* Card Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg" />
                  
                  {/* Step Number Badge */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                    className="relative z-10 w-14 h-14 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-300/50 group-hover:shadow-blue-400/70 transition-shadow duration-300"
                  >
                    {step.id}
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl -z-10 opacity-30 blur-sm group-hover:opacity-50 transition-opacity" />
                  </motion.div>

                  {/* Icon Container */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="relative z-10 w-28 h-28 mx-auto mb-6 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-100/50 group-hover:shadow-blue-200/70 transition-all duration-500 border border-blue-100"
                  >
                    <motion.div
                      initial={{ scale: 0.5, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.7, type: "spring" }}
                      className="relative"
                    >
                      <Icon className="w-12 h-12 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                      <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all duration-500" />
                    </motion.div>
                    
                    {/* Rotating Ring Animation */}
                    <motion.div
                      initial={{ rotate: 0 }}
                      whileInView={{ rotate: 360 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1 + index * 0.1, duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-dashed border-blue-200 rounded-3xl group-hover:border-blue-300 transition-colors"
                    />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    className="relative z-10 text-center px-4"
                  >
                    <motion.h3 
                      whileHover={{ scale: 1.05 }}
                      className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors duration-300"
                    >
                      {step.title}
                    </motion.h3>
                    <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Progress Dots */}
                  {index < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-0 w-full h-0.5 -z-10">
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-blue-300 to-blue-400 origin-right"
                      />
                      <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.5 + index * 0.1, duration: 0.4 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-300"
                      />
                    </div>
                  )}

                  {/* Floating Particles */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ 
                          x: Math.random() * 100 - 50,
                          y: Math.random() * 100 + 100,
                          opacity: 0,
                          scale: 0
                        }}
                        whileInView={{ 
                          y: [null, -20 - Math.random() * 30],
                          opacity: [0, 0.6, 0],
                          scale: [0, 1, 0.5]
                        }}
                        transition={{ 
                          delay: 1.5 + index * 0.1 + i * 0.3,
                          duration: 2 + Math.random(),
                          repeat: Infinity,
                          repeatDelay: 3 + Math.random() * 2
                        }}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full"
                      />
                    ))}
                  </div>
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

  const leftColumn = FAQS.slice(0, 3);
  const rightColumn = FAQS.slice(3);

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-4">
              الأسئلة الشائعة
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
              كل ما تريد معرفته عن أمديست
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              إذا لم تجد إجابة سؤالك، لا تتردد في التواصل معنا
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {leftColumn.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 flex items-center justify-between text-right hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-slate-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${openId === faq.id ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-slate-600 text-right">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {rightColumn.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 flex items-center justify-between text-right hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-slate-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${openId === faq.id ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-slate-600 text-right">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
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
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">أمديست</span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              منصة متخصصة في مساعدة طلاب فلسطين في غزة على الحصول على منح دراسية دولية.
            </p>

            <div className="flex gap-4">
              {['فيسبوك', 'تويتر', 'انستغرام', 'لينكدإن'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-sm hover:bg-blue-600 transition-colors"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-slate-400">
              {['الرئيسية', 'المنح', 'الخدمات', 'كيف نعمل', 'الأسئلة الشائعة'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">الخدمات</h4>
            <ul className="space-y-2 text-slate-400">
              {['التقديم الشامل', 'السيرة الذاتية', 'رسالة التحفيز', 'الترجمة', 'المتابعة'].map((service) => (
                <li key={service}>
                  <a href="#" className="hover:text-white transition-colors">{service}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>+970 59-123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>info@amdist.ps</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span>غزة، فلسطين</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
          <p>جميع الحقوق محفوظة © ٢٠٢٥ أمديست - منصة المنح الدراسية</p>
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
