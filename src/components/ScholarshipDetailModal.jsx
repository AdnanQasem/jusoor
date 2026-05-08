import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scholarshipFAQAPI } from '../services/api';
import {
  X, Building2, BookOpen, DollarSign, MapPin, Clock, AlertCircle,
  Info, CheckCircle, HelpCircle, ChevronDown, ExternalLink,
  Globe, FileText, HandCoins, Wallet, GraduationCap
} from 'lucide-react';
import ApplicationForm from '../pages/ApplicationForm';

// Convert Western numerals to Arabic-Indic numerals
const toArabicIndic = (num) => {
  const arabicIndicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (d) => arabicIndicNumerals[parseInt(d)]);
};

function ScholarshipDetailModal({ scholarship, onClose }) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedScholarshipFaqs, setSelectedScholarshipFaqs] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

  // Debug: Log scholarship data
  useEffect(() => {
    console.log('Scholarship Modal Data:', scholarship);
  }, [scholarship]);

  // Normalize scholarship data (handle both API and mock data formats)
  const normalizedScholarship = {
    ...scholarship,
    // Title (handle all variations)
    title: scholarship.title || scholarship.name || '',
    title_en: scholarship.title_en || scholarship.nameEn || '',
    
    // Country
    country_code: scholarship.country_code || scholarship.country || 'EU',
    countryName: scholarship.countryName || scholarship.country_name || '',
    
    // Scholarship type
    scholarship_type_display: scholarship.scholarship_type_display || scholarship.type_display || scholarship.type || '',
    scholarship_type: scholarship.scholarship_type || scholarship.type || '',
    
    // Funding type
    funding_type_display: scholarship.funding_type_display || scholarship.funding_type || scholarship.amount || 'كاملة',
    funding_type: scholarship.funding_type || scholarship.amount || 'كاملة',
    
    // Other fields
    university: scholarship.university || '',
    description: scholarship.description || '',
    fields: scholarship.fields || [],
    stipend: scholarship.stipend || '',
    deadline: scholarship.deadline || '',
    image: scholarship.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
    is_featured: scholarship.is_featured || scholarship.featured || false,
  };

  const daysLeft = Math.ceil((new Date(scholarship.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;

  useEffect(() => {
    if (scholarship?.id) {
      scholarshipFAQAPI.getByScholarship(scholarship.id)
        .then((response) => {
          setSelectedScholarshipFaqs(response.data?.results || response.data || []);
        })
        .catch((error) => {
          console.error('Error loading FAQs:', error);
          setSelectedScholarshipFaqs([]);
        });
    }
  }, [scholarship?.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (scholarship?.deadline) {
        const today = new Date();
        const deadline = new Date(scholarship.deadline);
        const diff = deadline - today;
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft({ days, hours, minutes });
        }
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [scholarship?.deadline]);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
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

  if (showApplicationForm) {
    return (
      <ApplicationForm
        scholarship={scholarship}
        onClose={() => setShowApplicationForm(false)}
        onSubmitSuccess={() => {
          setShowApplicationForm(false);
          onClose();
          alert('تم تقديم طلبك بنجاح! سنتواصل معك قريباً.');
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Hero Section */}
        <div className="relative h-48 overflow-hidden rounded-t-3xl">
          <img
            src={normalizedScholarship.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop'}
            alt={normalizedScholarship.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center shadow-lg">
                  <div className="w-10 h-10">
                    {COUNTRY_FLAGS[normalizedScholarship.country_code] || COUNTRY_FLAGS.EU}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{normalizedScholarship.title}</h2>
                  <p className="text-sm text-white/80">{normalizedScholarship.title_en}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Building2 className="w-5 h-5" />
                <span className="text-xs font-bold">الجامعة</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 line-clamp-1">{normalizedScholarship.university}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-bold">النوع</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{normalizedScholarship.scholarship_type_display || normalizedScholarship.scholarship_type}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-700 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-xs font-bold">التمويل</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{normalizedScholarship.funding_type_display || 'كاملة'}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-2 text-amber-700 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-bold">البلد</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{normalizedScholarship.countryName || normalizedScholarship.country_code}</p>
            </div>
          </div>

          {/* Countdown Timer */}
          {timeLeft.days !== undefined && (
            <div className="mb-8 p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-amber-400" />
                  <span className="font-bold text-lg">الوقت المتبقي للتقديم</span>
                </div>
                {timeLeft.days < 7 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-bold text-red-300">عاجل</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <div className="text-3xl font-bold text-amber-400">{toArabicIndic(timeLeft.days)}</div>
                  <div className="text-xs text-white/70 mt-1">يوم</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <div className="text-3xl font-bold text-amber-400">{toArabicIndic(timeLeft.hours)}</div>
                  <div className="text-xs text-white/70 mt-1">ساعة</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <div className="text-3xl font-bold text-amber-400">{toArabicIndic(timeLeft.minutes)}</div>
                  <div className="text-xs text-white/70 mt-1">دقيقة</div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {normalizedScholarship.description && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                عن المنحة
              </h3>
              <p className="text-slate-600 leading-relaxed">{normalizedScholarship.description}</p>
            </div>
          )}

          {/* Fields of Study */}
          {normalizedScholarship.fields && normalizedScholarship.fields.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                التخصصات المتاحة
              </h3>
              <div className="flex flex-wrap gap-2">
                {(normalizedScholarship.fields || []).map((field, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium">
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              المستندات المطلوبة
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'السيرة الذاتية (CV)',
                'كشف العلامات الجامعي',
                'شهادة اللغة (IELTS/TOEFL)',
                'رسالتي توصية',
                'المقال التحفيزي',
                'نسخة من جواز السفر'
              ].map((req, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          {selectedScholarshipFaqs.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                الأسئلة الشائعة
              </h3>
              <div className="space-y-3">
                {selectedScholarshipFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-4 bg-white hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors"
                    >
                      <span className="text-sm font-semibold text-slate-800 text-right flex-1">
                        {faq?.question || ''}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        expandedFaq === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-slate-50 border-t border-slate-100">
                            <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowApplicationForm(true)}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold text-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 group"
            >
              <span>قدّم الآن على المنحة</span>
              <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all duration-300"
            >
              إغلاق
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ScholarshipDetailModal;
