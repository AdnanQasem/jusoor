import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contactAPI } from '../services/api';
import {
  Mail, Phone, MapPin, MessageCircle, Send, Clock,
  Facebook, Twitter, Instagram, Linkedin, Globe,
  CheckCircle, AlertCircle, Loader, X
} from 'lucide-react';
import Header from '../components/Header';

function ContactPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const response = await contactAPI.getFAQ({ category: 'general' });
      setFaqs(response.data?.results || response.data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.subject.trim()) newErrors.subject = 'الموضوع مطلوب';
    if (!formData.message.trim()) newErrors.message = 'الرسالة مطلوب';

    setError('');
    if (Object.keys(newErrors).length > 0) {
      setError('يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await contactAPI.sendMessage(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field) => {
    setError('');
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'info@amdist.ps',
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'رقم الهاتف',
      value: '+970 59 999 9999',
      color: 'green'
    },
    {
      icon: MapPin,
      title: 'العنوان',
      value: 'غزة، فلسطين',
      color: 'red'
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      value: '9:00 ص - 5:00 م',
      color: 'purple'
    }
  ];

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header activeSection="contact" onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-serif">
              تواصل معنا
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              نحن هنا لمساعدتك في أي وقت. لا تتردد في التواصل معنا لأي استفسار أو مساعدة
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className={`w-14 h-14 rounded-xl bg-${item.color}-100 flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 text-${item.color}-600`} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-2">{item.title}</h3>
                  <p className="text-lg font-bold text-slate-900">{item.value}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">أرسل لنا رسالة</h2>
                  <p className="text-slate-600">سنرد عليك في أقرب وقت ممكن</p>
                </div>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className="text-emerald-700 font-semibold">تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 font-semibold">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => { setFormData({ ...formData, name: e.target.value }); clearFieldError('name'); }}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          error ? 'border-red-300 bg-red-50' : 'border-slate-300'
                        }`}
                        placeholder="الاسم الرباعي"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => { setFormData({ ...formData, email: e.target.value }); clearFieldError('email'); }}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          error ? 'border-red-300 bg-red-50' : 'border-slate-300'
                        }`}
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); clearFieldError('phone'); }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        error ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="+970 5X XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      الموضوع *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => { setFormData({ ...formData, subject: e.target.value }); clearFieldError('subject'); }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        error ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="موضوع الرسالة"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      الرسالة *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => { setFormData({ ...formData, message: e.target.value }); clearFieldError('message'); }}
                      rows={5}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                        error ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>إرسال الرسالة</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Map & Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              {/* Map Placeholder */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-80 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-slate-400" />
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108677.57687668295!2d34.3912629!3d31.5017106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d1d367a29d21b%3A0x6c3011d4a1c8e5e5!2sGaza!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(1) contrast(1.2) opacity(0.8)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">معلومات إضافية</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">الدعم الفني</h4>
                      <p className="text-sm text-slate-600">متاح على مدار الساعة للإجابة على استفساراتكم</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">التواصل الاجتماعي</h4>
                      <div className="flex gap-3 mt-2">
                        <a href="#" className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors">
                          <Facebook className="w-4 h-4 text-white" />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center hover:bg-sky-600 transition-colors">
                          <Twitter className="w-4 h-4 text-white" />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-lg bg-pink-600 flex items-center justify-center hover:bg-pink-700 transition-colors">
                          <Instagram className="w-4 h-4 text-white" />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center hover:bg-blue-800 transition-colors">
                          <Linkedin className="w-4 h-4 text-white" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">الأسئلة الشائعة</h2>
              <p className="text-slate-600">إجابات على الأسئلة الأكثر تكراراً</p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-slate-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 bg-white hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors text-right"
                  >
                    <span className="text-base font-semibold text-slate-800 flex-1">
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      expandedFaq === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 bg-slate-50 border-t border-slate-100">
                        <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ContactPage;
