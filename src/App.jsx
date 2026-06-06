import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { scholarshipsAPI, servicesAPI, serviceOrdersAPI, applicationsAPI, contactAPI, authAPI, scholarshipFAQAPI } from './services/api';
import iiiImage from './assets/iii.png';
import logoImage from './assets/logo.png';
import adImage from './assets/ad.jpg';
import ApplicationForm from './pages/ApplicationForm';
import ServiceOrderForm from './pages/ServiceOrderForm';
import ScholarshipDetailModal from './components/ScholarshipDetailModal';
import ContactPage from './pages/ContactPage';
import harvardLogo from './assets/logos/Harvard-Emblema-1536x864.png';
import cornellLogo from './assets/logos/Cornell-University-Logo-1536x864.png';
import princetonLogo from './assets/logos/University-of-Princeton-Emblem-1536x864.png';
import pennLogo from './assets/logos/University-of-Pennsylvania-Emblem-1536x864.png';
import yaleLogo from './assets/logos/Yale.jpg';
import michiganLogo from './assets/logos/University-of-Michigan-Logo-1536x864.png';
import texasLogo from './assets/logos/University-of-Texas-at-Austin-Seal-Logo-1536x864.png';
import uvaLogo from './assets/logos/71_UVALogo_2000x800-1536x614.jpg';
import northwesternLogo from './assets/logos/2000px-northwestern_university_seal-svg-1024x1024-1-768x768.png';
import Header from './components/Header';
import ScholarshipsPage from './pages/ScholarshipsPage';
import AdminPage from './pages/AdminPage';
import {
  GraduationCap,
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
  MessageCircle,
  AlertCircle,
  TrendingUp,
  Building2,
  Globe,
  FileCheck,
  Rocket,
  HelpCircle,
  Sparkles,
  Shield,
  Wallet,
  FileBadge,
  Hourglass,
  RefreshCcw,
  Star,
  X,
  Loader,
  CheckCircle
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
    deadline: "2026-02-15",
    amount: "كاملة",
    type: "ماجستير",
    fields: ["الهندسة", "العلوم", "الإدارة"],
    country: "EU",
    countryName: "أوروبا",
    featured: true,
    stipend: "1400€/شهر",
    image: "https://images.unsplash.com/photo-1555525503-a0a27e0d3559?w=800&h=400&fit=crop",
    accent: "blue"
  },
  {
    id: 2,
    name: "منحة فولبرايت",
    nameEn: "Fulbright",
    university: "حكومة الولايات المتحدة",
    deadline: "2026-03-30",
    amount: "كاملة",
    type: "ماجستير",
    fields: ["جميع التخصصات"],
    country: "US",
    countryName: "الولايات المتحدة",
    featured: true,
    stipend: "تأمين صحي + سكن",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop",
    accent: "indigo"
  },
  {
    id: 3,
    name: "منح الجامعات التركية",
    nameEn: "Turkiye Burslari",
    university: "الجامعات التركية",
    deadline: "2026-06-10",
    amount: "كاملة",
    type: "بكالوريوس",
    fields: ["الطب", "الهندسة", "الآداب"],
    country: "TR",
    countryName: "تركيا",
    featured: false,
    stipend: "مسكن مجاني",
    image: "https://images.unsplash.com/photo-1524231757912-21d49dd28086?w=800&h=400&fit=crop",
    accent: "red"
  },
  {
    id: 4,
    name: "منحة مجلس البحث البريطاني",
    nameEn: "Chevening",
    university: "حكومة المملكة المتحدة",
    deadline: "2026-01-05",
    amount: "كاملة",
    type: "ماجستير",
    fields: ["القيادة", "العلاقات الدولية"],
    country: "GB",
    countryName: "المملكة المتحدة",
    featured: true,
    stipend: "£1200/شهر",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop",
    accent: "slate"
  },
  {
    id: 5,
    name: "منحة DAAD الألمانية",
    nameEn: "DAAD",
    university: "الجامعات الألمانية",
    deadline: "2026-04-20",
    amount: "كاملة",
    type: "ماجستير",
    fields: ["الهندسة", "العلوم الطبيعية"],
    country: "DE",
    countryName: "ألمانيا",
    featured: false,
    stipend: "934€/شهر",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=400&fit=crop",
    accent: "gray"
  },
  {
    id: 6,
    name: "منحة الحكومة اليابانية",
    nameEn: "MEXT",
    university: "الجامعات اليابانية",
    deadline: "2026-05-15",
    amount: "كاملة",
    type: "بكالوريوس",
    fields: ["التكنولوجيا", "العلوم"],
    country: "JP",
    countryName: "اليابان",
    featured: false,
    stipend: "117,000¥/شهر",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=400&fit=crop",
    accent: "rose"
  },
  {
    id: 7,
    name: "منحة أستراليا الدولية",
    nameEn: "Australia Awards",
    university: "الجامعات الأسترالية",
    deadline: "2026-03-01",
    amount: "كاملة",
    type: "ماجستير",
    fields: ["التنمية", "الصحة العامة"],
    country: "AU",
    countryName: "أستراليا",
    featured: false,
    stipend: "AUD 3000/شهر",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
    accent: "cyan"
  },
  {
    id: 8,
    name: "منحة قطر الوطنية",
    nameEn: "Qatar National",
    university: "جامعة قطر",
    deadline: "2026-02-28",
    amount: "كاملة",
    type: "دكتوراه",
    fields: ["العلوم", "التكنولوجيا"],
    country: "QA",
    countryName: "قطر",
    featured: false,
    stipend: "QAR 8000/شهر",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&h=400&fit=crop",
    accent: "amber"
  }
];

// Country flag SVG paths
const COUNTRY_FLAGS = {
  EU: (
    <svg viewBox="0 0 60 40" className="w-full h-full">
      <rect fill="#003399" width="60" height="40"/>
      <g fill="#FFCC00">
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x = 30 + 12 * Math.cos(angle);
          const y = 20 + 12 * Math.sin(angle);
          return (
            <path key={i} d={`M ${x} ${y-1.5} L ${x+0.3} ${y-0.5} L ${x+1.3} ${y-0.5} L ${x+0.5} ${y+0.2} L ${x+0.8} ${y+1.2} L ${x} ${y+0.6} L ${x-0.8} ${y+1.2} L ${x-0.5} ${y+0.2} L ${x-1.3} ${y-0.5} L ${x-0.3} ${y-0.5} Z`}/>
          );
        })}
      </g>
    </svg>
  ),
  US: (
    <svg viewBox="0 0 60 40" className="w-full h-full">
      <rect fill="#B22234" width="60" height="40"/>
      <rect fill="#FFF" y="3" width="60" height="3"/>
      <rect fill="#FFF" y="9" width="60" height="3"/>
      <rect fill="#FFF" y="15" width="60" height="3"/>
      <rect fill="#FFF" y="21" width="60" height="3"/>
      <rect fill="#FFF" y="27" width="60" height="3"/>
      <rect fill="#FFF" y="33" width="60" height="3"/>
      <rect fill="#3C3B6E" width="24" height="22"/>
    </svg>
  ),
  TR: (
    <svg viewBox="0 0 60 40" className="w-full h-full">
      <rect fill="#E30A17" width="60" height="40"/>
      <circle fill="#FFF" cx="24" cy="20" r="8"/>
      <circle fill="#E30A17" cx="26" cy="20" r="6"/>
      <path fill="#FFF" d="M 36 17 L 37 20 L 40 20 L 37.5 22 L 38.5 25 L 36 23 L 33.5 25 L 34.5 22 L 32 20 L 35 20 Z"/>
    </svg>
  ),
  GB: (
    <svg viewBox="0 0 60 40" className="w-full h-full">
      <rect fill="#012169" width="60" height="40"/>
      <path stroke="#FFF" strokeWidth="5" d="M 0 0 L 60 40 M 60 0 L 0 40"/>
      <path stroke="#C8102E" strokeWidth="3" d="M 0 0 L 60 40 M 60 0 L 0 40"/>
      <rect fill="#FFF" x="27" width="6" height="40"/>
      <rect fill="#FFF" y="17" width="60" height="6"/>
      <rect fill="#C8102E" x="28.5" width="3" height="40"/>
      <rect fill="#C8102E" y="18.5" width="60" height="3"/>
    </svg>
  ),
  DE: (
    <svg viewBox="0 0 60 40" className="w-full h-full">
      <rect fill="#000" width="60" height="40"/>
      <rect fill="#DD0000" y="13.3" width="60" height="13.3"/>
      <rect fill="#FFCE00" y="26.6" width="60" height="13.3"/>
    </svg>
  ),
  JP: (
    <svg viewBox="0 0 60 40" className="w-full h-full">
      <rect fill="#FFF" width="60" height="40"/>
      <circle fill="#BC002D" cx="30" cy="20" r="10"/>
    </svg>
  ),
  AU: (
    <svg viewBox="0 0 60 40" className="w-full h-full">
      <rect fill="#00008B" width="60" height="40"/>
      <rect fill="#FFF" y="0" width="30" height="20"/>
      <path stroke="#C8102E" strokeWidth="2" d="M 0 0 L 30 20 M 30 0 L 0 20"/>
      <rect fill="#C8102E" x="13.5" width="3" height="20"/>
      <rect fill="#C8102E" y="8.5" width="30" height="3"/>
    </svg>
  ),
  QA: (
    <svg viewBox="0 0 60 40" className="w-full h-full">
      <rect fill="#8A1538" width="60" height="40"/>
      <path fill="#FFF" d="M 0 0 L 15 0 L 12 3 L 15 6 L 12 9 L 15 12 L 12 15 L 15 18 L 12 21 L 15 24 L 12 27 L 15 30 L 12 33 L 15 36 L 12 39 L 0 39 Z"/>
    </svg>
  )
};


const FAQS = [
  {
    id: 1,
    question: "ما هي منصة جسور؟",
    answer: "جسور هي منصة متخصصة تهدف إلى مساعدة طلاب فلسطين في غزة على الحصول على منح دراسية دولية. نقدم خدمات متكاملة تشمل البحث عن المنح، إعداد الأوراق، ومتابعة الطلبات حتى القبول.",
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
    label: "اختيار المنحة",
    title: "نحدد الطريق",
    description: "تبدأ بمنحة أو خدمة واضحة، ونحوّل هدفك إلى متطلبات قابلة للتنفيذ بدل قائمة طويلة مربكة.",
    duration: "10 دقائق",
    output: "خطة تقديم مختصرة",
    bullets: ["الموعد النهائي والمتطلبات الأساسية", "ما لديك وما ينقصك", "أول خطوة منطقية حسب وضعك"],
    icon: Search,
    accent: "blue"
  },
  {
    id: 2,
    label: "تجهيز المعلومات",
    title: "تسلّمنا موادك",
    description: "ترفع معلوماتك والملفات المتوفرة مرة واحدة، ونطلب الناقص فقط حتى لا تعيد نفس التفاصيل أكثر من مرة.",
    duration: "15 دقيقة",
    output: "ملف منظم",
    bullets: ["السيرة أو بياناتها الأساسية", "الشهادات والكشوفات المتوفرة", "ملاحظاتك عن التخصص والجامعة"],
    icon: Upload,
    accent: "emerald"
  },
  {
    id: 3,
    label: "صياغة ومراجعة",
    title: "نراجع ونبني الملف",
    description: "نشتغل على السيرة، رسالة التحفيز، وترتيب الطلب حسب متطلبات الجهة، بصياغة واضحة بدون مبالغة.",
    duration: "24-72 ساعة",
    output: "مسودة قابلة للمراجعة",
    bullets: ["اتساق القصة بين المستندات", "نقاط القوة التي تستحق الظهور", "تنبيه مبكر لأي نقص أو مخاطرة"],
    icon: FileCheck,
    accent: "amber"
  },
  {
    id: 4,
    label: "اعتماد ومتابعة",
    title: "تراجع ثم ننهي",
    description: "تشوف النسخة النهائية، نعالج ملاحظاتك، ونجهّزك للخطوة التالية قبل الموعد.",
    duration: "قبل الموعد",
    output: "ملف جاهز للتقديم",
    bullets: ["نسخة نهائية مرتبة", "قائمة إرسال واضحة", "متابعة عند الحاجة"],
    icon: Rocket,
    accent: "slate"
  }
];

const STEP_ACCENT_STYLES = {
  blue: {
    selected: "border-blue-500 bg-blue-50 shadow-sm shadow-blue-100/70",
    icon: "bg-blue-600 text-white",
    softIcon: "bg-blue-50 text-blue-600",
    text: "text-blue-700",
    pill: "bg-blue-50 text-blue-700 border-blue-100",
    bar: "bg-blue-600"
  },
  emerald: {
    selected: "border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-100/70",
    icon: "bg-emerald-600 text-white",
    softIcon: "bg-emerald-50 text-emerald-600",
    text: "text-emerald-700",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
    bar: "bg-emerald-600"
  },
  amber: {
    selected: "border-amber-500 bg-amber-50 shadow-sm shadow-amber-100/70",
    icon: "bg-amber-600 text-white",
    softIcon: "bg-amber-50 text-amber-700",
    text: "text-amber-700",
    pill: "bg-amber-50 text-amber-700 border-amber-100",
    bar: "bg-amber-600"
  },
  slate: {
    selected: "border-slate-700 bg-slate-100 shadow-sm shadow-slate-200/70",
    icon: "bg-slate-900 text-white",
    softIcon: "bg-slate-100 text-slate-700",
    text: "text-slate-800",
    pill: "bg-slate-100 text-slate-700 border-slate-200",
    bar: "bg-slate-900"
  }
};

const WORKFLOW_ASSURANCES = [
  {
    title: "مراجعة قبل الاعتماد",
    description: "ترى النسخة النهائية وتعلّق عليها قبل تثبيتها.",
    icon: Shield
  },
  {
    title: "تواصل مختصر",
    description: "نطلب النواقص بوضوح ونرسل لك الخطوة التالية فقط.",
    icon: MessageCircle
  },
  {
    title: "بدون قوالب جاهزة",
    description: "الصياغة مبنية على قصتك ومتطلبات المنحة، لا نص عام لكل المتقدمين.",
    icon: FileText
  }
];

// ==========================================
// COMPONENTS
// ==========================================

// Convert Western numerals to Arabic-Indic numerals
const toArabicIndic = (num) => {
  const arabicIndicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (d) => arabicIndicNumerals[parseInt(d)]);
};

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
    ? `${toArabicIndic(count)}${suffix}`
    : target;

  return <span ref={ref}>{displayValue}</span>;
}

function Hero({ onNavigate }) {
  const [scholarshipCount, setScholarshipCount] = useState(30);
  const stats = [
    { number: scholarshipCount, suffix: "+", label: "منحة نشطة", icon: GraduationCap },
    { number: 2000, suffix: "+", label: "طالب مساعد", icon: TrendingUp },
    { number: 48, suffix: "ساعة", label: "وقت المعالجة", icon: Clock },
    { number: 50, suffix: "+", label: "جامعة شريكة", icon: Building2 },
  ];

  useEffect(() => {
    scholarshipsAPI.getAll()
      .then(response => {
        const data = response.data?.results || response.data || [];
        const activeCount = Array.isArray(data) ? data.length : 0;
        setScholarshipCount(activeCount);
      })
      .catch(err => {
        console.error('Error fetching scholarship count:', err);
      });
  }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col bg-white overflow-hidden relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={adImage}
          alt="Background"
          className="w-full h-full object-cover scale-105"
        />
        {/* Soft gradient overlay to calm the background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-slate-100/80" />
      </div>

      <div className="flex-1 flex items-center pt-20 pb-12 relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1320px] mx-auto">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 lg:gap-8 items-center">
              {/* Text Content with Premium Container */}
              <div className="text-right order-2 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  {/* Soft overlay container behind text */}
                  <div className="absolute -inset-2 lg:-inset-5 bg-white/75 backdrop-blur-md rounded-2xl lg:rounded-[28px] border border-white/50 shadow-sm shadow-slate-200/30" />

                  {/* Content */}
                  <div className="relative z-10 p-4 lg:p-7">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="relative"
                    >
                      <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold mb-3 lg:mb-4">
                        منصة المنح الدراسية الأولى في فلسطين
                      </span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 leading-tight mb-4 lg:mb-6 font-serif"
                      style={{ textShadow: '0 1px 2px rgba(255,255,255,0.6)' }}
                    >
                      <span className="block">منحة أقرب إليك</span>
                      <span className="block">و<span className="text-blue-700">ملف تقديم</span> يليق بطموحك</span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="text-sm sm:text-base lg:text-lg text-slate-700 mb-5 lg:mb-7 leading-relaxed"
                      style={{ textShadow: '0 1px 1px rgba(255,255,255,0.5)' }}
                    >
                      نساعدك تكتشف أحدث المنح الدراسية، ونجهز لك ملف التقديم الاحترافي — من السيرة الذاتية ورسالة التحفيز إلى المتابعة حتى القبول.
                      <br />
                      <span className="text-slate-900 font-semibold">كل اللي تحتاجه في مكان واحد</span>، عشان تركز أنت على هدفك وتوصل للقبول بثقة.
                    </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate('scholarships')}
                      className="w-full sm:w-auto px-5 lg:px-7 py-3 lg:py-3.5 bg-blue-600 text-white rounded-xl text-sm lg:text-base font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-200/40"
                    >
                      <span>استعرض المنح المتاحة</span>
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate('services')}
                      className="w-full sm:w-auto px-5 lg:px-7 py-3 lg:py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm lg:text-base font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors"
                    >
                      خدماتنا وأسعارنا
                    </motion.button>
                  </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Image Column */}
              <div className="relative order-1 lg:order-2 mb-6 lg:mb-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative"
                >
                  <div className="relative rounded-xl lg:rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={iiiImage}
                      alt="Students"
                      className="w-full h-48 sm:h-64 md:h-72 lg:h-[420px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                  className="group relative bg-white rounded-xl p-4 shadow-md shadow-blue-100/40 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 border border-blue-50/60"
                >
                  <div className="flex flex-col items-center text-center gap-2.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 mb-0.5">
                        <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                      </p>
                      <p className="text-xs text-slate-600 font-medium">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}



// Services Section - Premium SaaS Design
function ServicesSection({ onSelectService, onNavigateToScholarships }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    servicesAPI.getAll()
      .then(response => {
        // Handle both paginated and non-paginated responses
        const data = response.data?.results || response.data || [];
        setServices(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching services:', err);
        setError('تعذر تحميل الخدمات. تأكد من تشغيل الخادم.');
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="w-20 h-8 bg-slate-200 rounded-full mx-auto mb-5 animate-pulse" />
            <div className="w-48 h-10 bg-slate-200 rounded-xl mx-auto mb-4 animate-pulse" />
            <div className="w-80 h-5 bg-slate-200 rounded mx-auto animate-pulse" />
          </div>
          {/* Cards Skeleton */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-7">
                <div className="w-3/4 h-6 bg-slate-200 rounded mb-1 animate-pulse" />
                <div className="w-1/2 h-4 bg-slate-200 rounded mb-4 animate-pulse" />
                <div className="w-20 h-10 bg-slate-200 rounded mb-4 animate-pulse" />
                <div className="w-full h-4 bg-slate-200 rounded mb-2 animate-pulse" />
                <div className="w-2/3 h-4 bg-slate-200 rounded mb-6 animate-pulse" />
                <div className="h-px bg-slate-200 mb-6" />
                <div className="space-y-3 mb-6">
                  {[1, 2, 3].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-slate-200 rounded-md animate-pulse" />
                      <div className="flex-1 h-4 bg-slate-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="w-full h-11 bg-slate-200 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-24 bg-white relative">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-slate-50/50 to-transparent rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold mb-5">
              خدماتنا
            </span>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-5 font-serif tracking-tight">
              اختر الخدمة المناسبة لك
            </h2>

            {/* Subtitle */}
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              خدمات احترافية لمساعدتك في التقديم للمنح والفرص الأكاديمية
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const isHighlighted = service.service_type === 'cover_letter';
            const isGold = service.service_type === 'full_application';

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className={`group relative bg-white hover:bg-slate-50 rounded-2xl border transition-all duration-300 flex flex-col ${
                  isHighlighted
                    ? 'border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50'
                    : isGold
                      ? 'border-amber-200/50 shadow-lg shadow-amber-100/30 hover:shadow-xl hover:shadow-amber-100/50'
                      : 'border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200'
                }`}
              >
                {/* Card Content */}
                <div className="p-6 lg:p-7 flex-1 flex flex-col">
                  {/* Title Section */}
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium">
                      {service.title_en}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className={`text-4xl font-bold ${isGold ? 'text-amber-600' : isHighlighted ? 'text-slate-900' : 'text-blue-600'}`}>
                      {service.price}
                    </span>
                    <span className="text-slate-500 font-semibold">₪</span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {isGold && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-right">
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-amber-700 shadow-sm">
                        <RefreshCcw className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-900">استرداد في حال الرفض</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-amber-800">
                          إذا تم رفض طلبك بعد التقديم، يمكنك طلب الاسترداد حسب شروط الخدمة.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className={`h-px mb-6 ${isGold ? 'bg-gradient-to-r from-amber-200 via-amber-100 to-transparent' : 'bg-slate-100'}`} />

                  {/* Features */}
                  <ul className="space-y-3 mb-6 flex-1">
                    {(service.features || []).map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-right">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isGold
                            ? 'bg-amber-100'
                            : isHighlighted
                              ? 'bg-slate-900'
                              : 'bg-blue-100'
                        }`}>
                          <Check className={`w-3 h-3 ${
                            isGold
                              ? 'text-amber-700'
                              : isHighlighted
                                ? 'text-white'
                                : 'text-blue-600'
                          }`} />
                        </div>
                        <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (service.service_type === 'full_application') {
                        onNavigateToScholarships && onNavigateToScholarships();
                      } else {
                        onSelectService(service);
                      }
                    }}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      isHighlighted
                        ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-300/50'
                        : isGold
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-200/50'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-blue-200/50'
                    }`}
                  >
                    {service.service_type === 'full_application' ? 'استعرض المنح' : 'اطلب الخدمة'}
                  </motion.button>
                </div>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900/0 to-slate-900/0 group-hover:from-slate-900/5 group-hover:to-slate-900/5 transition-all duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

// Scholarships Section - Featured Only
function ScholarshipsSection({ onViewAll, onScholarshipSelect }) {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    scholarshipsAPI.getAll({ featured: true })
      .then(response => {
        const data = response.data?.results || response.data || [];
        setScholarships(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching featured scholarships:', err);
        setError(null);
        setScholarships([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getDaysLeft = (deadline) => {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyStyle = (days) => {
    if (days <= 0) return { bg: 'bg-slate-100', text: 'text-slate-500', label: 'انتهى' };
    if (days < 7) return { bg: 'bg-orange-50', text: 'text-orange-700', label: 'عاجل' };
    if (days < 14) return { bg: 'bg-amber-50', text: 'text-amber-700', label: `${days} يوم` };
    if (days < 30) return { bg: 'bg-slate-50', text: 'text-slate-600', label: `${days} يوم` };
    return { bg: 'bg-slate-50', text: 'text-slate-600', label: `${days} يوم` };
  };

  // COUNTRY_FLAGS
  const COUNTRY_FLAGS = {
    EU: (
      <svg viewBox="0 0 60 40" className="w-full h-full">
        <rect fill="#003399" width="60" height="40"/>
        <g fill="#FFCC00">
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x = 30 + 12 * Math.cos(angle);
            const y = 20 + 12 * Math.sin(angle);
            return (
              <path key={i} d={`M ${x} ${y-1.5} L ${x+0.3} ${y-0.5} L ${x+1.3} ${y-0.5} L ${x+0.5} ${y+0.2} L ${x+0.8} ${y+1.2} L ${x} ${y+0.6} L ${x-0.8} ${y+1.2} L ${x-0.5} ${y+0.2} L ${x-1.3} ${y-0.5} L ${x-0.3} ${y-0.5} Z`}/>
            );
          })}
        </g>
      </svg>
    ),
    US: (
      <svg viewBox="0 0 60 40" className="w-full h-full">
        <rect fill="#B22234" width="60" height="40"/>
        <rect fill="#FFF" y="3" width="60" height="3"/>
        <rect fill="#FFF" y="9" width="60" height="3"/>
        <rect fill="#FFF" y="15" width="60" height="3"/>
        <rect fill="#FFF" y="21" width="60" height="3"/>
        <rect fill="#FFF" y="27" width="60" height="3"/>
        <rect fill="#FFF" y="33" width="60" height="3"/>
        <rect fill="#3C3B6E" width="24" height="22"/>
      </svg>
    ),
    TR: (
      <svg viewBox="0 0 60 40" className="w-full h-full">
        <rect fill="#E30A17" width="60" height="40"/>
        <circle fill="#FFF" cx="24" cy="20" r="8"/>
        <circle fill="#E30A17" cx="26" cy="20" r="6"/>
        <path fill="#FFF" d="M 36 17 L 37 20 L 40 20 L 37.5 22 L 38.5 25 L 36 23 L 33.5 25 L 34.5 22 L 32 20 L 35 20 Z"/>
      </svg>
    ),
    GB: (
      <svg viewBox="0 0 60 40" className="w-full h-full">
        <rect fill="#012169" width="60" height="40"/>
        <path stroke="#FFF" strokeWidth="5" d="M 0 0 L 60 40 M 60 0 L 0 40"/>
        <path stroke="#C8102E" strokeWidth="3" d="M 0 0 L 60 40 M 60 0 L 0 40"/>
        <rect fill="#FFF" x="27" width="6" height="40"/>
        <rect fill="#FFF" y="17" width="60" height="6"/>
        <rect fill="#C8102E" x="28.5" width="3" height="40"/>
        <rect fill="#C8102E" y="18.5" width="60" height="3"/>
      </svg>
    ),
    DE: (
      <svg viewBox="0 0 60 40" className="w-full h-full">
        <rect fill="#000" width="60" height="40"/>
        <rect fill="#DD0000" y="13.3" width="60" height="13.3"/>
        <rect fill="#FFCE00" y="26.6" width="60" height="13.3"/>
      </svg>
    ),
    JP: (
      <svg viewBox="0 0 60 40" className="w-full h-full">
        <rect fill="#FFF" width="60" height="40"/>
        <circle fill="#BC002D" cx="30" cy="20" r="10"/>
      </svg>
    ),
    AU: (
      <svg viewBox="0 0 60 40" className="w-full h-full">
        <rect fill="#00008B" width="60" height="40"/>
        <rect fill="#FFF" y="0" width="30" height="20"/>
        <path stroke="#C8102E" strokeWidth="2" d="M 0 0 L 30 20 M 30 0 L 0 20"/>
        <rect fill="#C8102E" x="13.5" width="3" height="20"/>
        <rect fill="#C8102E" y="8.5" width="30" height="3"/>
      </svg>
    ),
    QA: (
      <svg viewBox="0 0 60 40" className="w-full h-full">
        <rect fill="#8A1538" width="60" height="40"/>
        <path fill="#FFF" d="M 0 0 L 15 0 L 12 3 L 15 6 L 12 9 L 15 12 L 12 15 L 15 18 L 12 21 L 15 24 L 12 27 L 15 30 L 12 33 L 15 36 L 12 39 L 0 39 Z"/>
      </svg>
    )
  };

  if (loading) {
    return (
      <section id="scholarships" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-lg text-slate-500">جاري تحميل المنح...</div>
        </div>
      </section>
    );
}

  return (
    <section id="scholarships" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle radial background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-50/25 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold mb-5 tracking-wide"
          >
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            المنح المميزة
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif tracking-tight"
          >
            فرص <span className="text-blue-600">مميزة</span> لك
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-slate-600 max-w-xl mx-auto text-base leading-relaxed"
          >
            مجموعة مختارة من أفضل المنح المتاحة للطلاب الفلسطينيين
          </motion.p>

          {/* View All Button */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={onViewAll}
            className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 mx-auto"
          >
            <span>عرض جميع المنح</span>
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Featured Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {scholarships.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <GraduationCap className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg font-medium mb-2">لا توجد منح مميزة حالياً</p>
              <button
                onClick={onViewAll}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <span>عرض جميع المنح المتاحة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            scholarships.slice(0, 4).map((scholarship, index) => {
              const daysLeft = getDaysLeft(scholarship.deadline);
              const isExpired = scholarship.is_expired === true || daysLeft <= 0;
              const urgency = getUrgencyStyle(daysLeft);

              return (
                <motion.div
                  key={scholarship.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  onClick={() => onScholarshipSelect && onScholarshipSelect(scholarship)}
                  className="group bg-white rounded-[22px] border border-amber-200 shadow-md shadow-amber-100/30 cursor-pointer transition-all duration-300 overflow-hidden"
                >
                  {/* Image Strip */}
                  <div className="relative h-40 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent z-10" />
                    <img
                      src={scholarship.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop'}
                      alt={scholarship.countryName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Featured Badge */}
                    <div className="absolute top-3 right-3 z-20">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 backdrop-blur-sm text-amber-700 rounded-md text-xs font-semibold shadow-sm">
                        <Star className="w-3 h-3 fill-current" />
                        مميزة
                      </span>
                    </div>

                    {/* Country Flag Badge */}
                    <div className="absolute bottom-3 right-3 z-20 w-10 h-7 rounded-md overflow-hidden shadow-md border border-white/50">
                      {COUNTRY_FLAGS[scholarship.country_code] || COUNTRY_FLAGS.EU}
                    </div>

                    {/* Status Badge */}
                    <div className={`absolute bottom-3 left-3 z-20 px-2.5 py-1.5 rounded-md backdrop-blur-sm ${urgency.bg.replace('bg-', 'bg-').replace('50', '50/90')}`}>
                      <span className={`text-xs font-semibold ${urgency.text}`}>
                        {urgency.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Title */}
                    <div className="mb-4">
                      <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">
                        {scholarship.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {scholarship.title_en}
                      </p>
                    </div>

                    {/* University */}
                    <div className="flex items-center gap-2.5 mb-4 text-sm text-slate-600">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="line-clamp-1">{scholarship.university}</span>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 mb-4" />

                    {/* Tags Row */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                        {scholarship.scholarship_type_display || scholarship.scholarship_type}
                      </span>
                      <span className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                        {scholarship.funding_type_display || scholarship.funding_type}
                      </span>
                      {scholarship.stipend && (
                        <span className="px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                          {scholarship.stipend}
                        </span>
                      )}
                    </div>

                    {/* Fields */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {(scholarship.fields || []).slice(0, 3).map((field, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded text-xs">
                          {field}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isExpired && onScholarshipSelect) {
                          onScholarshipSelect(scholarship);
                        }
                      }}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        isExpired
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md'
                      }`}
                      disabled={isExpired}
                    >
                      {isExpired ? 'المنحة انتهت - انتظر الدورة القادمة' : (
                        <>
                          <span>تفاصيل المنحة</span>
                          <ArrowLeft className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection({ onNavigate }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = STEPS[activeStepIndex];
  const ActiveIcon = activeStep.icon;
  const activeStyles = STEP_ACCENT_STYLES[activeStep.accent];
  const progressPercent = ((activeStepIndex + 1) / STEPS.length) * 100;

  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-slate-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-semibold mb-5 tracking-wide">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              كيف نعمل
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-5 font-serif tracking-tight">
              من أول سؤال إلى ملف جاهز للتقديم
            </h2>

            <p className="text-slate-600 max-w-xl text-base leading-relaxed">
              كل خطوة لها مخرج واضح: نحدد المطلوب، نرتب ملفاتك، نراجع الصياغة، ثم نسلّمك نسخة تعرف بالضبط كيف تستخدمها.
            </p>

            <div className="mt-8 space-y-3">
              {WORKFLOW_ASSURANCES.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex items-start gap-3 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => onNavigate?.('scholarships')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>استعرض المنح</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('services')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-800 rounded-lg text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>جهّز مستنداتي</span>
              </button>
            </div>
          </motion.div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const styles = STEP_ACCENT_STYLES[step.accent];
                const isActive = activeStepIndex === index;

                return (
                  <motion.button
                    key={step.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06, duration: 0.35 }}
                    whileHover={{ y: -2 }}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveStepIndex(index)}
                    onMouseEnter={() => setActiveStepIndex(index)}
                    onFocus={() => setActiveStepIndex(index)}
                    className={`group min-h-[132px] rounded-lg border p-4 text-right transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isActive
                        ? styles.selected
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive ? styles.icon : 'bg-slate-100 text-slate-500 group-hover:bg-white'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-bold ${isActive ? styles.text : 'text-slate-500'}`}>
                            خطوة {toArabicIndic(step.id)}
                          </span>
                          {isActive && <span className={`w-2 h-2 rounded-full ${styles.bar}`} />}
                        </div>
                        <h3 className="mt-1 text-base font-bold text-slate-900">{step.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">{step.label}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 lg:p-7 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${activeStyles.icon}`}>
                      <ActiveIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${activeStyles.text}`}>{activeStep.label}</p>
                      <h3 className="mt-1 text-2xl font-bold text-slate-900">{activeStep.title}</h3>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-bold ${activeStyles.pill}`}>
                    <Clock className="w-4 h-4" />
                    {activeStep.duration}
                  </span>
                </div>

                <p className="mt-5 text-slate-600 leading-relaxed">{activeStep.description}</p>

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-500">
                    <span>تقدّم الرحلة</span>
                    <span>خطوة {toArabicIndic(activeStep.id)} من {toArabicIndic(STEPS.length)}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${activeStyles.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <dl className="mt-6 grid sm:grid-cols-2 border-y border-slate-200">
                  <div className="py-4 sm:border-l sm:border-slate-200 sm:pl-5">
                    <dt className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Clock className="w-4 h-4" />
                      الوقت المتوقع
                    </dt>
                    <dd className="mt-1 text-lg font-bold text-slate-900">{activeStep.duration}</dd>
                  </div>
                  <div className="py-4 sm:pr-5">
                    <dt className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <CheckCircle className="w-4 h-4" />
                      المخرج العملي
                    </dt>
                    <dd className="mt-1 text-lg font-bold text-slate-900">{activeStep.output}</dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <p className="text-sm font-bold text-slate-900">نراجع هنا</p>
                  <ul className="mt-3 grid gap-3">
                    {activeStep.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                        <span className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${activeStyles.softIcon}`}>
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, receipt: 'حجم الملف يجب أن يكون أقل من 5 ميجا' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, receipt: 'يجب رفع صورة (PNG أو JPG)' });
        return;
      }
      setFormData({ ...formData, receipt: file });
      setErrors({ ...errors, receipt: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.transactionId.trim()) {
      newErrors.transactionId = 'رقم العملية مطلوب';
    } else if (formData.transactionId.length < 5) {
      newErrors.transactionId = 'رقم العملية غير صحيح';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^05[0-9]{8}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = 'أدخل رقم هاتف صحيح (059xxxxxxx)';
    }
    if (!formData.receipt) {
      newErrors.receipt = 'يرجى إرفاق إيصال الدفع';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Step 1: Create service order
      const orderData = {
        service: service.id,
        transaction_id: formData.transactionId,
        phone: formData.phone,
      };

      console.log('Creating service order:', orderData);
      const response = await serviceOrdersAPI.create(orderData);
      console.log('Service order created:', response.data);
      const orderId = response.data.id;

      // Step 2: Upload receipt
      if (formData.receipt) {
        console.log('Uploading receipt for order:', orderId);
        await serviceOrdersAPI.uploadReceipt(orderId, formData.receipt);
        console.log('Receipt uploaded successfully');
      }

      alert('تم استلام طلبك بنجاح! سنتواصل معك قريباً.');
      onClose();
    } catch (error) {
      console.error('Payment submission error:', error);
      console.error('Error response:', error?.response?.data);
      const msg = error?.response?.data?.detail || error?.response?.data?.message || error?.message || 'حدث خطأ في تقديم الطلب. يرجى المحاولة مرة أخرى.';
      setErrors({ ...errors, submit: msg });
    } finally {
      setIsSubmitting(false);
    }
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
                  value={formData.transactionId}
                  onChange={(e) => {
                    setFormData({ ...formData, transactionId: e.target.value });
                    if (errors.transactionId) setErrors({ ...errors, transactionId: null });
                  }}
                  placeholder="أدخل رقم العملية من PalPay"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.transactionId
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-50/50'
                  }`}
                />
                {errors.transactionId && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.transactionId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  رقم الهاتف للتواصل
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                  placeholder="059-xxxxxxx"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-50/50'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  إيصال الدفع
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) handleFileDrop({ preventDefault: () => {}, dataTransfer: { files: [file] } });
                    };
                    input.click();
                  }}
                  className={`upload-zone border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    errors.receipt
                      ? 'border-red-300 bg-red-50'
                      : isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 hover:border-blue-400'
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
                      <p className="text-slate-600 mb-1">اسحب الملف هنا أو اضغط للتصفح</p>
                      <p className="text-sm text-slate-400">PNG, JPG حتى ٥ ميجا</p>
                    </div>
                  )}
                </div>
                {errors.receipt && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.receipt}
                  </p>
                )}
                {errors.submit && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submit}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  السابق
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <span>تأكيد الطلب</span>
                  )}
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
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    contactAPI.getFAQ()
      .then(response => {
        // Handle both paginated and non-paginated responses
        const data = response.data?.results || response.data || [];
        setFaqs(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching FAQs:', err);
        setError('تعذر تحميل الأسئلة الشائعة');
        setFaqs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <section id="faq" className="py-24 bg-gradient-to-b from-white via-blue-50/50 to-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="text-lg text-slate-500">جاري تحميل الأسئلة الشائعة...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="faq" className="py-24 bg-gradient-to-b from-white via-blue-50/50 to-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="text-red-500">{error}</div>
        </div>
      </section>
    );
  }

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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-5 font-serif">
              كل ما تريد معرفته عن <span className="gradient-text-blue">جسور</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              إذا لم تجد إجابة سؤالك، لا تتردد في التواصل معنا
            </p>
          </motion.div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
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
                  className={`group bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 ${isOpen
                      ? 'border-blue-300 shadow-xl shadow-blue-100/50'
                      : 'border-slate-100 hover:border-blue-200 hover:shadow-lg'
                    }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4 text-right min-h-[64px]"
                  >
                    {/* Question */}
                    <span className={`flex-1 font-bold text-right text-lg ${isOpen ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-700'
                      }`}>
                      {faq.question}
                    </span>

                    {/* Chevron */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                        }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 md:p-6 pt-0 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
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
  const universityLogos = [
    harvardLogo, princetonLogo, yaleLogo, cornellLogo, pennLogo,
    michiganLogo, texasLogo, uvaLogo, northwesternLogo
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">شركاؤنا في النجاح</h3>
          <p className="text-slate-500 text-sm">نفتخر بشراكتنا مع أفضل الجامعات العالمية</p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex animate-marquee-rtl hover:pause">
            {[...universityLogos, ...universityLogos].map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center mx-6 flex-shrink-0 group"
              >
                <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 border border-slate-100">
                  <img
                    src={logo}
                    alt="University Logo"
                    className="h-24 md:h-28 w-auto object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-12 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-slate-300"></div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Comparison Section
function ComparisonSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            لماذا تختار <span className="text-blue-600">جسور</span>؟
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            مقارنة واضحة توضح الفرق بين الطريقة التقليدية ومنصة جسور
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Traditional */}
          <div className="order-2 bg-slate-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border-2 border-slate-200">
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">الطريقة التقليدية</h3>
                <p className="text-sm text-slate-600 mt-1">بدون دعم أو تنظيم</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm mb-1">البحث عن المنح</p>
                  <p className="text-slate-600 text-sm leading-relaxed">ساعات طويلة بين المواقع المختلفة</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm mb-1">المواعيد النهائية</p>
                  <p className="text-slate-600 text-sm leading-relaxed">ضياع المواعيد أو التأخر في التقديم</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm mb-1">إعداد الملفات</p>
                  <p className="text-slate-600 text-sm leading-relaxed">ملفات غير احترافية أو ناقصة</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm mb-1">المتابعة والإرشاد</p>
                  <p className="text-slate-600 text-sm leading-relaxed">صعوبة المتابعة بدون دعم</p>
                </div>
              </div>
            </div>
          </div>

          {/* Jusoor */}
          <div className="order-1 bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border-2 border-blue-600 shadow-lg sm:shadow-xl shadow-blue-100">
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8 pb-4 sm:pb-6 border-b border-blue-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">منصة جسور</h3>
                <p className="text-sm text-slate-600 mt-1">حل متكامل واحترافي</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm mb-1">البحث عن المنح</p>
                  <p className="text-slate-600 text-sm leading-relaxed">قائمة موحدة ومحدثة باستمرار</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm mb-1">المواعيد النهائية</p>
                  <p className="text-slate-600 text-sm leading-relaxed">تنبيهات واضحة وتتابع منظم</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm mb-1">إعداد الملفات</p>
                  <p className="text-slate-600 text-sm leading-relaxed">تجهيز احترافي متكامل</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm mb-1">المتابعة والإرشاد</p>
                  <p className="text-slate-600 text-sm leading-relaxed">مرافقة حتى اكتمال التقديم</p>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-blue-100">
              <div className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-semibold">
                <Star className="w-4 h-4 fill-current flex-shrink-0" />
                الخيار الأفضل للطلاب الطموحين
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Reusable Comparison Item Component
function ComparisonItem({ text, type, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: type === 'positive' ? -8 : 8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-stone-50 transition-colors duration-200"
    >
      {/* Icon Indicator */}
      <div className="flex-shrink-0 mt-0.5">
        {type === 'positive' ? (
          <div className="w-5 h-5 rounded-sm bg-slate-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-slate-700" strokeWidth={2.5} />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-sm bg-stone-100 flex items-center justify-center">
            <X className="w-3 h-3 text-stone-600" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Text */}
      <span className={`text-sm leading-relaxed ${
        type === 'positive' ? 'text-slate-700' : 'text-stone-600'
      }`}>
        {text}
      </span>
    </motion.div>
  );
}

// Direct Admissions Section
function DirectAdmissionsSection({ onNavigate }) {
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
                type="button"
                onClick={() => onNavigate?.('scholarships')}
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
function LegacyFooter() {
  const socialLinks = [
    { name: 'فيسبوك', icon: MessageCircle, href: '#' },
    { name: 'تويتر', icon: Globe, href: '#' },
    { name: 'انستغرام', icon: MessageCircle, href: '#' },
    { name: 'لينكدإن', icon: Globe, href: '#' }
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
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:pr-2">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <img
                src={logoImage}
                alt="جسور"
                className="h-10 w-auto"
              />
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              منصة تساعد الطلاب الفلسطينيين على اكتشاف المنح الدراسية وتجهيز ملفات التقديم باحترافية.
            </p>

            {/* Social Links */}
            <div className="flex gap-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                    title={social.name}
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">
              روابط سريعة
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">
              الخدمات
            </h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.label}>
                  <a
                    href={service.href}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 inline-block"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">
              تواصل معنا
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500" />
                <a href="tel:972592286907" className="text-sm text-slate-400 hover:text-white transition-colors" dir="ltr">+972 59 228 6907</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-400 hover:text-white transition-colors">info@amdist.ps</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-400 hover:text-white transition-colors">غزة، فلسطين</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              جميع الحقوق محفوظة © ٢٠٢٥ جسور - منصة المنح الدراسية
            </p>
            <div className="flex items-center gap-5 text-xs text-slate-500">
              <a href="#" className="hover:text-blue-400 transition-colors duration-200">سياسة الخصوصية</a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-200">شروط الاستخدام</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Footer({ onNavigate }) {
  const currentYear = toArabicIndic(new Date().getFullYear());
  const quickLinks = [
    { label: 'الرئيسية', target: 'home' },
    { label: 'المنح', target: 'scholarships' },
    { label: 'الخدمات', target: 'services' },
    { label: 'كيف نعمل', target: 'how-it-works' },
    { label: 'الأسئلة الشائعة', target: 'faq' },
    { label: 'تواصل معنا', target: 'contact' },
  ];

  const contactLinks = [
    { label: '+972 59 228 6907', href: 'tel:+972592286907', icon: Phone, dir: 'ltr' },
    { label: 'info@amdist.ps', href: 'mailto:info@amdist.ps', icon: Mail, dir: 'ltr' },
    { label: 'غزة، فلسطين', href: null, icon: MapPin },
  ];

  const socialLinks = [
    { name: 'واتساب', href: 'https://wa.me/970592286907', icon: MessageCircle },
    { name: 'البريد الإلكتروني', href: 'mailto:info@amdist.ps', icon: Mail },
    { name: 'اتصال مباشر', href: 'tel:+972592286907', icon: Phone },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-blue-300 mb-2">جاهز تبدأ؟</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">اختصر طريقك للمنحة المناسبة</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => onNavigate?.('scholarships')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
              >
                استعرض المنح
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('contact')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                تواصل معنا
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_0.95fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white">
                <img src={logoImage} alt="جسور" className="h-9 w-auto" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">جسور</p>
                <p className="text-xs text-slate-500">منصة المنح الدراسية</p>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-7 text-slate-400">
              نساعد الطلاب على اكتشاف المنح المناسبة وتجهيز ملفات تقديم مرتبة وواضحة، من البحث حتى إرسال الطلب.
            </p>

            <div className="mt-6 flex gap-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                    aria-label={social.name}
                    title={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-white">روابط سريعة</h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <li key={link.target}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(link.target)}
                    className="text-sm text-slate-400 transition-colors hover:text-blue-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-white">معلومات التواصل</h3>
            <ul className="space-y-3">
              {contactLinks.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <Icon className="w-4 h-4 flex-shrink-0 text-blue-300" />
                    <span dir={item.dir} className="text-sm">{item.label}</span>
                  </>
                );

                return (
                  <li key={item.label} className="text-slate-400">
                    {item.href ? (
                      <a href={item.href} className="flex items-center gap-3 transition-colors hover:text-white">
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-right">
            <p className="text-xs text-slate-500">جميع الحقوق محفوظة © {currentYear} جسور.</p>
            <p className="text-xs text-slate-500">تصميم مختصر يساعد الطالب على الوصول بسرعة إلى المعلومات المهمة.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// MAIN APP
// ==========================================

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [pendingSection, setPendingSection] = useState(null);

  const pushPageHistory = (page) => {
    const url = page === 'home'
      ? `${window.location.pathname}${window.location.search}`
      : `#${page}`;
    const isSameUrl = page === 'home'
      ? !window.location.hash
      : window.location.hash === `#${page}`;

    if (window.history.state?.page !== page || !isSameUrl) {
      window.history.pushState({ page }, '', url);
    }
  };

  const handleNavigate = (sectionId) => {
    if (sectionId === 'scholarships') {
      pushPageHistory('scholarships');
      setPendingSection(null);
      setCurrentPage('scholarships');
      setActiveSection('scholarships');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'contact') {
      pushPageHistory('contact');
      setPendingSection(null);
      setCurrentPage('contact');
      setActiveSection('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentPage !== 'home') {
      pushPageHistory('home');
    }

    setCurrentPage('home');
    setActiveSection(sectionId);
    setPendingSection(sectionId);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      const page = event.state?.page || 'home';

      setPendingSection(null);
      setSelectedService(null);
      setSelectedScholarship(null);
      setCurrentPage(page);
      setActiveSection(page === 'home' ? 'home' : page);
    };

    if (!window.history.state?.page) {
      window.history.replaceState({ page: currentPage }, '', window.location.href);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (currentPage !== 'home' || !pendingSection) return;

    const timeoutId = window.setTimeout(() => {
      if (pendingSection === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(pendingSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      setPendingSection(null);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [currentPage, pendingSection]);

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
      {currentPage === 'scholarships' ? (
        <ScholarshipsPage onNavigate={handleNavigate} />
      ) : currentPage === 'admin' ? (
        <AdminPage />
      ) : currentPage === 'contact' ? (
        <ContactPage onNavigate={handleNavigate} />
      ) : (
        <>
          <Header activeSection={activeSection} onNavigate={handleNavigate} />

          <main>
            <Hero onNavigate={handleNavigate} />
            <ScholarshipsSection onViewAll={() => handleNavigate('scholarships')} onScholarshipSelect={setSelectedScholarship} />
            <ComparisonSection />
            <ServicesSection onSelectService={setSelectedService} onNavigateToScholarships={() => handleNavigate('scholarships')} />
            <HowItWorksSection onNavigate={handleNavigate} />
            <FAQSection />
            <PartnersSection />
            <DirectAdmissionsSection onNavigate={handleNavigate} />
          </main>

          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/970599999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-5 sm:py-3.5 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="font-bold text-xs sm:text-sm hidden xs:inline">تواصل معنا</span>
      </a>

      <AnimatePresence>
        {selectedService && (
          <>
            {selectedService.service_type === 'full_application' ? (
              <PaymentModal
                service={selectedService}
                onClose={() => setSelectedService(null)}
              />
            ) : (
              <ServiceOrderForm
                service={selectedService}
                onClose={() => setSelectedService(null)}
                onSubmitSuccess={() => setSelectedService(null)}
              />
            )}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedScholarship && (
          <ScholarshipDetailModal
            scholarship={selectedScholarship}
            onClose={() => setSelectedScholarship(null)}
            onSubmitSuccess={() => {
              setSelectedScholarship(null);
              handleNavigate('home');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
