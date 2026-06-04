import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scholarshipsAPI, scholarshipFAQAPI } from '../services/api';
import { Search, ArrowLeft, X, Star, Building2, AlertCircle, RefreshCcw } from 'lucide-react';
import Header from '../components/Header';
import ApplicationForm from './ApplicationForm';
import ScholarshipDetailModal from '../components/ScholarshipDetailModal';

// Convert Western numerals to Arabic-Indic numerals
const toArabicIndic = (num) => {
  const arabicIndicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (d) => arabicIndicNumerals[parseInt(d)]);
};

const FILTERS = [
  { label: 'الكل', value: 'all' },
  { label: 'البكالوريوس', value: 'bachelor' },
  { label: 'الماجستير', value: 'master' },
  { label: 'الدكتوراه', value: 'phd' },
];

const SCHOLARSHIP_TYPE_LABELS = {
  bachelor: 'بكالوريوس',
  master: 'ماجستير',
  phd: 'دكتوراه',
};

const FUNDING_TYPE_LABELS = {
  full: 'كاملة',
  partial: 'جزئية',
  tuition: 'رسوم فقط',
};

function ScholarshipsPage({ onNavigate }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarshipFaqs, setSelectedScholarshipFaqs] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  const loadScholarships = useCallback(() => {
    setLoading(true);
    setError(null);

    scholarshipsAPI.getAll()
      .then(response => {
        const data = response.data?.results || response.data || [];
        setScholarships(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching scholarships:', err);
        setError('تعذر تحميل المنح');
        setScholarships([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadScholarships();
  }, [loadScholarships]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = {};
      scholarships.forEach(s => {
        if (s.deadline) {
          const today = new Date();
          const deadline = new Date(s.deadline);
          const diff = deadline - today;
          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            newTimeLeft[s.id] = { days, hours, minutes };
          }
        }
      });
      setTimeLeft(newTimeLeft);
    }, 60000);
    return () => clearInterval(timer);
  }, [scholarships]);

  const getFilterCount = (filterValue) => {
    if (filterValue === 'all') return (scholarships || []).length;
    return (scholarships || []).filter(s => s.scholarship_type === filterValue).length;
  };

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredScholarships = scholarships.filter(s => {
    const fields = Array.isArray(s.fields) ? s.fields : [];
    const searchableText = [
      s.title,
      s.title_en,
      s.university,
      s.country,
      ...fields,
    ].filter(Boolean).join(' ').toLowerCase();

    const matchesFilter = filter === 'all' || s.scholarship_type === filter;
    const matchesSearch = !normalizedSearchQuery || searchableText.includes(normalizedSearchQuery);
    return matchesFilter && matchesSearch;
  });

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
    if (days < 7) return { bg: 'bg-red-50', text: 'text-red-700', label: 'عاجل' };
    if (days < 14) return { bg: 'bg-orange-50', text: 'text-orange-700', label: `${days} يوم` };
    if (days < 30) return { bg: 'bg-amber-50', text: 'text-amber-700', label: `${days} يوم` };
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', label: `${days} يوم` };
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const getScholarshipFAQs = (scholarship) => {
    if (selectedScholarshipFaqs && selectedScholarshipFaqs.length > 0) {
      return selectedScholarshipFaqs;
    }
    return [];
  };

  useEffect(() => {
    if (selectedScholarship?.id) {
      scholarshipFAQAPI.getByScholarship(selectedScholarship.id)
        .then((response) => {
          setSelectedScholarshipFaqs(response.data?.results || response.data || []);
        })
        .catch((error) => {
          console.error('Error loading FAQs:', error);
          setSelectedScholarshipFaqs([]);
        });
    } else {
      setSelectedScholarshipFaqs([]);
    }
  }, [selectedScholarship?.id]);

  // COUNTRY_FLAGS - same as App.jsx
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
      <div className="min-h-screen bg-white">
        <Header activeSection="scholarships" onNavigate={onNavigate} />
        <div className="pt-24 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Skeleton */}
            <div className="text-center mb-14">
              <div className="w-32 h-8 bg-slate-200 rounded-full mx-auto mb-5 animate-pulse" />
              <div className="w-64 h-10 bg-slate-200 rounded-xl mx-auto mb-4 animate-pulse" />
              <div className="w-96 h-5 bg-slate-200 rounded mx-auto animate-pulse" />
            </div>
            {/* Filter & Search Skeleton */}
            <div className="flex flex-col lg:flex-row gap-3 mb-10 items-center justify-between">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-24 h-10 bg-slate-200 rounded-lg animate-pulse" />
                ))}
              </div>
              <div className="w-full lg:w-64 h-10 bg-slate-200 rounded-lg animate-pulse" />
            </div>
            {/* Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="h-40 bg-slate-200 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="w-3/4 h-5 bg-slate-200 rounded animate-pulse" />
                    <div className="w-1/2 h-4 bg-slate-200 rounded animate-pulse" />
                    <div className="h-px bg-slate-200" />
                    <div className="flex gap-2">
                      <div className="w-16 h-6 bg-slate-200 rounded animate-pulse" />
                      <div className="w-16 h-6 bg-slate-200 rounded animate-pulse" />
                    </div>
                    <div className="w-full h-10 bg-slate-200 rounded-xl animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header activeSection="scholarships" onNavigate={onNavigate} />

        <section className="min-h-screen pt-24 pb-20 flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-lg mx-auto text-center rounded-2xl border border-red-100 bg-red-50/60 px-6 py-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">تعذر تحميل المنح</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                لم نتمكن من جلب قائمة المنح الآن. تحقق من اتصال الخادم وحاول مرة أخرى.
              </p>
              <button
                onClick={loadScholarships}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header activeSection="scholarships" onNavigate={onNavigate} />
      
      <section className="py-24 relative overflow-hidden">
        {/* Subtle radial background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-50/25 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold mb-5 tracking-wide"
            >
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              المنح الدراسية
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif tracking-tight"
            >
              اكتشف <span className="text-blue-600">فرصك</span> الدراسية
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed"
            >
              قائمة محدثة بأفضل المنح المتاحة للطلاب الفلسطينيين
            </motion.p>
          </div>

          {/* Controls: Filters + Search */}
          <div className="flex flex-col lg:flex-row gap-3 mb-10 items-center justify-between">
            {/* Filter Tabs */}
            <div className="w-full lg:w-auto overflow-x-auto pb-1">
              <div className="flex min-w-max gap-2 justify-start lg:justify-center">
                {FILTERS.map((f) => {
                  const count = getFilterCount(f.value);
                  const isActive = filter === f.value;
                  return (
                    <button
                      key={f.value}
                      onClick={() => setFilter(f.value)}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 min-h-[44px] ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {f.label}
                      <span className={`mr-2 px-1.5 py-0.5 rounded-md text-xs ${
                        isActive ? 'bg-white/20' : 'bg-slate-200'
                      }`}>
                        {toArabicIndic(count)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-auto lg:flex-1 max-w-md">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث باسم المنحة أو الجامعة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X />
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <p className="text-sm text-slate-500">
              عرض {toArabicIndic(filteredScholarships.length)} من أصل {toArabicIndic(scholarships.length)} منحة
            </p>
          </div>

          {/* Scholarships Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filteredScholarships.map((scholarship, index) => {
              const daysLeft = getDaysLeft(scholarship.deadline);
              const isExpired = daysLeft <= 0;
              const urgency = getUrgencyStyle(daysLeft);
              const typeLabel = scholarship.scholarship_type_display || SCHOLARSHIP_TYPE_LABELS[scholarship.scholarship_type] || scholarship.scholarship_type;
              const fundingLabel = scholarship.funding_type_display || FUNDING_TYPE_LABELS[scholarship.funding_type] || scholarship.funding_type;

              return (
                <motion.div
                  key={scholarship.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedScholarship(scholarship)}
                  className={`group h-full bg-white rounded-[22px] border cursor-pointer transition-all duration-300 overflow-hidden ${
                    scholarship.is_featured
                      ? 'border-amber-200 shadow-md shadow-amber-100/30'
                      : 'border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50'
                  }`}
                >
                  {/* Image Strip */}
                  <div className="relative h-40 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent z-10" />
                    <img
                      src={scholarship.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop'}
                      alt={scholarship.countryName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Featured Badge on Image */}
                    {scholarship.is_featured && (
                      <div className="absolute top-3 right-3 z-20">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 backdrop-blur-sm text-amber-700 rounded-md text-xs font-semibold shadow-sm">
                          <Star className="w-3 h-3 fill-current" />
                          مميزة
                        </span>
                      </div>
                    )}

                    {/* Country Flag Badge */}
                    <div className="absolute bottom-3 right-3 z-20 w-10 h-7 rounded-md overflow-hidden shadow-md border border-white/50">
                      {COUNTRY_FLAGS[scholarship.country_code] || COUNTRY_FLAGS.EU}
                    </div>

                    {/* Status Badge */}
                    <div className={`absolute bottom-3 left-3 z-20 px-2.5 py-1.5 rounded-md backdrop-blur-sm ${
                      urgency.bg.replace('bg-', 'bg-').replace('50', '50/90')
                    }`}>
                      <span className={`text-xs font-semibold ${urgency.text}`}>
                        {urgency.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 min-h-[280px] flex flex-col">
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
                        {typeLabel}
                      </span>
                      <span className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                        {fundingLabel}
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
                      className={`w-full mt-auto py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        isExpired
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md'
                      }`}
                      disabled={isExpired}
                    >
                      {isExpired ? 'انتهى التقديم' : (
                        <>
                          <span>تفاصيل المنحة</span>
                          <ArrowLeft className="w-4 h-4" />
                        </>
                      )}
                    </button>
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
              className="text-center py-20"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Search className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">لا توجد نتائج</h3>
              <p className="text-slate-500 text-sm mb-6">لم نجد منح تطابق بحثك. جرب أحد الفلاتر التالية:</p>

              <div className="flex flex-wrap gap-2 justify-center">
                {FILTERS.filter(f => f.value !== 'all').map((f) => (
                  <button
                    key={f.value}
                    onClick={() => {
                      setFilter(f.value);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    عرض {f.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Scholarship Modal */}
      <AnimatePresence>
        {selectedScholarship && (
          <ScholarshipDetailModal
            scholarship={selectedScholarship}
            onClose={() => setSelectedScholarship(null)}
          />
        )}
      </AnimatePresence>
      
      {/* Application Form Modal */}
      <AnimatePresence>
        {showApplicationForm && selectedScholarship && (
          <ApplicationForm
            scholarship={selectedScholarship}
            onClose={() => setShowApplicationForm(false)}
            onSubmitSuccess={() => {
              setShowApplicationForm(false);
              setSelectedScholarship(null);
              alert('تم تقديم طلبك بنجاح! سنتواصل معك قريباً.');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ScholarshipsPage;
