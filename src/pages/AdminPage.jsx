import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scholarshipsAPI, scholarshipFAQAPI, applicationsAPI } from '../services/api';
import {
  Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp,
  Building2, Calendar, MapPin, BookOpen, DollarSign,
  Image as ImageIcon, Link as LinkIcon, Star, AlertCircle,
  CheckCircle, HelpCircle, ArrowLeft, FileText, User, Mail, Phone
} from 'lucide-react';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('scholarships');
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    university: '',
    country_code: 'EU',
    countryName: '',
    scholarship_type: 'bachelor',
    scholarship_type_display: 'بكالوريوس',
    funding_type: 'full',
    funding_type_display: 'كاملة',
    deadline: '',
    fields: [],
    stipend: '',
    image: '',
    application_url: '',
    description: '',
    is_featured: false
  });
  const [newField, setNewField] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'general' });
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  const COUNTRY_OPTIONS = [
    { code: 'EU', name: 'أوروبا' },
    { code: 'US', name: 'الولايات المتحدة' },
    { code: 'TR', name: 'تركيا' },
    { code: 'GB', name: 'المملكة المتحدة' },
    { code: 'DE', name: 'ألمانيا' },
    { code: 'JP', name: 'اليابان' },
    { code: 'AU', name: 'أستراليا' },
    { code: 'QA', name: 'قطر' }
  ];

  useEffect(() => {
    loadScholarships();
    if (activeTab === 'applications') {
      loadApplications();
    }
  }, [activeTab]);

  const loadScholarships = async () => {
    setLoading(true);
    try {
      const response = await scholarshipsAPI.getAll();
      const data = response.data?.results || response.data || [];
      setScholarships(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationsAPI.getAll();
      const data = response.data?.results || response.data || [];
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFaqs = async (scholarshipId) => {
    try {
      const response = await scholarshipFAQAPI.getByScholarship(scholarshipId);
      setFaqs(response.data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_en: '',
      university: '',
      country_code: 'EU',
      countryName: '',
      scholarship_type: 'bachelor',
      scholarship_type_display: 'بكالوريوس',
      funding_type: 'full',
      funding_type_display: 'كاملة',
      deadline: '',
      fields: [],
      stipend: '',
      image: '',
      application_url: '',
      description: '',
      is_featured: false
    });
    setEditingScholarship(null);
    setShowForm(false);
    setFaqs([]);
  };

  const handleEdit = async (scholarship) => {
    setFormData({
      title: scholarship.title || '',
      title_en: scholarship.title_en || '',
      university: scholarship.university || '',
      country_code: scholarship.country_code || 'EU',
      countryName: scholarship.countryName || '',
      scholarship_type: scholarship.scholarship_type || 'bachelor',
      scholarship_type_display: scholarship.scholarship_type_display || 'بكالوريوس',
      funding_type: scholarship.funding_type || 'full',
      funding_type_display: scholarship.funding_type_display || 'كاملة',
      deadline: scholarship.deadline || '',
      fields: scholarship.fields || [],
      stipend: scholarship.stipend || '',
      image: scholarship.image || '',
      application_url: scholarship.application_url || '',
      description: scholarship.description || '',
      is_featured: scholarship.is_featured || false
    });
    setEditingScholarship(scholarship);
    setShowForm(true);
    await loadFaqs(scholarship.id);
  };

  const handleAddField = () => {
    if (newField.trim() && !formData.fields.includes(newField.trim())) {
      setFormData({ ...formData, fields: [...formData.fields, newField.trim()] });
      setNewField('');
    }
  };

  const handleRemoveField = (fieldToRemove) => {
    setFormData({ ...formData, fields: formData.fields.filter(f => f !== fieldToRemove) });
  };

  const handleAddFaq = async () => {
    if (newFaq.question.trim() && newFaq.answer.trim() && editingScholarship) {
      try {
        await scholarshipFAQAPI.create({
          ...newFaq,
          scholarship: editingScholarship.id
        });
        await loadFaqs(editingScholarship.id);
        setNewFaq({ question: '', answer: '', category: 'general' });
      } catch (error) {
        console.error('Error adding FAQ:', error);
        alert('حدث خطأ في إضافة السؤال');
      }
    }
  };

  const handleRemoveFaq = async (faqId) => {
    if (!editingScholarship) return;
    try {
      await scholarshipFAQAPI.delete(faqId);
      await loadFaqs(editingScholarship.id);
    } catch (error) {
      console.error('Error removing FAQ:', error);
      alert('حدث خطأ في حذف السؤال');
    }
  };

  const handleUpdateFaq = async (faqId, field, value) => {
    try {
      await scholarshipFAQAPI.update(faqId, { [field]: value });
      await loadFaqs(editingScholarship.id);
    } catch (error) {
      console.error('Error updating FAQ:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingScholarship) {
        await scholarshipsAPI.update(editingScholarship.id, formData);
      } else {
        await scholarshipsAPI.create(formData);
      }
      await loadScholarships();
      resetForm();
    } catch (error) {
      console.error('Error saving scholarship:', error);
      alert('حدث خطأ في الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const CATEGORY_CHOICES = [
    { value: 'general', label: 'عام' },
    { value: 'application', label: 'التقديم' },
    { value: 'requirements', label: 'المتطلبات' },
    { value: 'financial', label: 'التمويل' },
    { value: 'visa', label: 'التأشيرة' },
    { value: 'accommodation', label: 'السكن' },
    { value: 'other', label: 'أخرى' }
  ];

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه المنحة؟')) return;
    setLoading(true);
    try {
      await scholarshipsAPI.delete(id);
      await loadScholarships();
    } catch (error) {
      console.error('Error deleting scholarship:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaqExpand = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h1 className="text-xl font-bold text-slate-900">لوحة التحكم - المنح</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة منحة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'scholarships'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            المنح الدراسية
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'applications'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            الطلبات
            {applications.length > 0 && (
              <span className="mr-2 px-2 py-0.5 bg-white/20 rounded-md text-xs">
                {applications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {loading && !showForm && (
          <div className="text-center py-12">
            <div className="text-slate-500">جاري التحميل...</div>
          </div>
        )}

        {!showForm && activeTab === 'scholarships' && (
          <div className="grid gap-4">
            {scholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{scholarship.title}</h3>
                      {scholarship.is_featured && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          مميزة
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{scholarship.title_en}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{scholarship.university}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{scholarship.countryName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{scholarship.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-400" />
                        <span>0 سؤال</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(scholarship)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(scholarship.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Applications Section */}
        {!showForm && activeTab === 'applications' && (
          <div className="grid gap-4">
            {applications.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">لا توجد طلبات بعد</h3>
                <p className="text-slate-500">لم يتم تقديم أي طلبات للمنح حتى الآن</p>
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{app.full_name}</h3>
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                          app.status === 'submitted' ? 'bg-green-100 text-green-700' :
                          app.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {app.status === 'submitted' ? 'مُقدم' :
                           app.status === 'under_review' ? 'قيد المراجعة' :
                           app.status === 'accepted' ? 'مقبول' :
                           app.status === 'rejected' ? 'مرفوض' : 'مسودة'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span>{app.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span>{app.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-slate-400" />
                          <span>{app.field_of_study}</span>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">
                        قدم على: <span className="font-semibold text-slate-700">{app.scholarship_title || `منحة #${app.scholarship}`}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                        {new Date(app.created_at).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={app.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="السيرة الذاتية"
                      >
                        <FileText className="w-5 h-5 text-blue-600" />
                      </a>
                      {app.payment_receipt && (
                        <a
                          href={app.payment_receipt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="إيصال الدفع"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={resetForm}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingScholarship ? 'تعديل المنحة' : 'إضافة منحة جديدة'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        اسم المنحة (عربي) *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        اسم المنحة (إنجليزي) *
                      </label>
                      <input
                        type="text"
                        value={formData.title_en}
                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      الجامعة / المؤسسة
                    </label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        البلد
                      </label>
                      <select
                        value={formData.country_code}
                        onChange={(e) => {
                          const country = COUNTRY_OPTIONS.find(c => c.code === e.target.value);
                          setFormData({
                            ...formData,
                            country_code: e.target.value,
                            countryName: country?.name || ''
                          });
                        }}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {COUNTRY_OPTIONS.map((c) => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        نوع المنحة
                      </label>
                      <select
                        value={formData.scholarship_type}
                        onChange={(e) => {
                          const displays = {
                            bachelor: 'بكالوريوس',
                            master: 'ماجستير',
                            phd: 'دكتوراه'
                          };
                          setFormData({
                            ...formData,
                            scholarship_type: e.target.value,
                            scholarship_type_display: displays[e.target.value]
                          });
                        }}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="bachelor">بكالوريوس</option>
                        <option value="master">ماجستير</option>
                        <option value="phd">دكتوراه</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        نوع التمويل
                      </label>
                      <select
                        value={formData.funding_type}
                        onChange={(e) => {
                          const displays = {
                            full: 'كاملة',
                            partial: 'جزئية',
                            tuition: 'رسوم فقط'
                          };
                          setFormData({
                            ...formData,
                            funding_type: e.target.value,
                            funding_type_display: displays[e.target.value]
                          });
                        }}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="full">كاملة</option>
                        <option value="partial">جزئية</option>
                        <option value="tuition">رسوم فقط</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        موعد الانتهاء *
                      </label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        الراتب الشهري (اختياري)
                      </label>
                      <input
                        type="text"
                        value={formData.stipend}
                        onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="مثال: 1400€/شهر"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      رابط التقديم
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="url"
                        value={formData.application_url}
                        onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                        className="w-full pr-10 pl-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      رابط الصورة
                    </label>
                    <div className="relative">
                      <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full pr-10 pl-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      وصف المنحة
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="اكتب وصفاً تفصيلياً للمنحة..."
                    />
                  </div>

                  {/* Fields */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      التخصصات المتاحة
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newField}
                        onChange={(e) => setNewField(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddField())}
                        className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أضف تخصصاً"
                      />
                      <button
                        type="button"
                        onClick={handleAddField}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.fields.map((field, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2"
                        >
                          {field}
                          <button
                            type="button"
                            onClick={() => handleRemoveField(field)}
                            className="hover:text-blue-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                    />
                    <label htmlFor="is_featured" className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      جعلها منحة مميزة (تظهر في الصفحة الرئيسية)
                    </label>
                  </div>

                    {/* FAQs */}
                    <div className="border-t border-slate-200 pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <HelpCircle className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-bold text-slate-900">الأسئلة الشائعة الخاصة بالمنحة</h3>
                      </div>

                      <div className="space-y-3 mb-4">
                        {faqs.map((faq, index) => (
                          <div
                            key={faq.id}
                            className="border border-slate-200 rounded-xl overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => toggleFaqExpand(index)}
                              className="w-full p-4 bg-white hover:bg-slate-50 flex items-center justify-between gap-4"
                            >
                              <span className="text-sm font-semibold text-slate-800 text-right flex-1">
                                {faq.question}
                              </span>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                expandedFaqIndex === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-600'
                              }`}>
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </button>
                            <AnimatePresence>
                              {expandedFaqIndex === index && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                                    <div>
                                      <label className="block text-xs font-semibold text-slate-600 mb-1">التصنيف</label>
                                      <select
                                        value={faq.category}
                                        onChange={(e) => handleUpdateFaq(faq.id, 'category', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      >
                                        {CATEGORY_CHOICES.map((cat) => (
                                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-slate-600 mb-1">السؤال</label>
                                      <input
                                        type="text"
                                        value={faq.question}
                                        onChange={(e) => handleUpdateFaq(faq.id, 'question', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-slate-600 mb-1">الإجابة</label>
                                      <textarea
                                        value={faq.answer}
                                        onChange={(e) => handleUpdateFaq(faq.id, 'answer', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </div>
                                    <div className="flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFaq(faq.id)}
                                        className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold flex items-center gap-1"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        حذف
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                        <h4 className="text-sm font-semibold text-slate-700">إضافة سؤال جديد</h4>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">التصنيف</label>
                          <select
                            value={newFaq.category}
                            onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {CATEGORY_CHOICES.map((cat) => (
                              <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="text"
                          value={newFaq.question}
                          onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="السؤال"
                        />
                        <textarea
                          value={newFaq.answer}
                          onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="الإجابة"
                        />
                        <button
                          type="button"
                          onClick={handleAddFaq}
                          disabled={!editingScholarship}
                          className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Plus className="w-5 h-5" />
                          إضافة السؤال
                        </button>
                      </div>
                    </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-slate-200">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {editingScholarship ? 'تحديث المنحة' : 'حفظ المنحة'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminPage;
