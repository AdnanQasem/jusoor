import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { servicesAPI, serviceOrdersAPI } from '../services/api';
import {
  X, Upload, User, Mail, Phone, FileText, CheckCircle, AlertCircle, Loader, ArrowLeft,
  GraduationCap, BookOpen, CreditCard, PartyPopper
} from 'lucide-react';
import Header from '../components/Header';

function ServiceOrderForm({ service, onClose, onSubmitSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRefs = useRef({});
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    university: '',
    field_of_study: '',
    graduation_year: '',
    gpa: '',
    cv_file: null,
    old_cv: null,
    motivation_letter: null,
    job_description: null,
    additional_info: ''
  });

  const [errors, setErrors] = useState({});

  const ACCEPTED_TYPES = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'الاسم الكامل مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صحيح';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.university.trim()) newErrors.university = 'الجامعة مطلوبة';
    if (!formData.field_of_study.trim()) newErrors.field_of_study = 'التخصص مطلوب';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (service.service_type === 'cv') {
      if (!formData.old_cv) {
        newErrors.old_cv = 'السيرة الذاتية القديمة مطلوبة';
      }
    } else if (service.service_type === 'cover_letter') {
      if (!formData.cv_file) {
        newErrors.cv_file = 'السيرة الذاتية مطلوبة';
      }
      if (!formData.job_description) {
        newErrors.job_description = 'وصف الوظيفة/المنحة مطلوب';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFileChange = (field, file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, [field]: 'حجم الملف يجب أن لا يتجاوز 10MB' }));
      return;
    }

    if (!ACCEPTED_TYPES.some(ext => file.name.toLowerCase().endsWith(ext))) {
      setErrors(prev => ({ ...prev, [field]: 'صيغة الملف غير مقبولة' }));
      return;
    }

    setFormData(prev => ({ ...prev, [field]: file }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleRemoveFile = (field) => {
    setFormData(prev => ({ ...prev, [field]: null }));
    setUploadProgress(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (fileInputRefs.current[field]) {
      fileInputRefs.current[field].value = '';
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError('');
    try {
      const orderData = {
        service: service.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        university: formData.university,
        field_of_study: formData.field_of_study,
        graduation_year: formData.graduation_year || '',
        gpa: formData.gpa || '',
        additional_info: formData.additional_info || ''
      };

      const response = await serviceOrdersAPI.create(orderData);
      const orderId = response.data.id;

      const documents = [];
      if (service.service_type === 'cv') {
        documents.push({ field: 'old_cv', type: 'old_cv' });
      } else if (service.service_type === 'cover_letter') {
        documents.push({ field: 'cv_file', type: 'cv_file' });
        documents.push({ field: 'job_description', type: 'job_description' });
      }

      let uploadErrors = [];
      for (const doc of documents) {
        if (formData[doc.field]) {
          setUploadProgress(prev => ({ ...prev, [doc.field]: 'uploading' }));
          try {
            await serviceOrdersAPI.uploadDocument(orderId, formData[doc.field], doc.type);
            setUploadProgress(prev => ({ ...prev, [doc.field]: 'uploaded' }));
          } catch (error) {
            console.error(`Error uploading ${doc.field}:`, error);
            setUploadProgress(prev => ({ ...prev, [doc.field]: 'error' }));
            uploadErrors.push(doc.field);
          }
        }
      }

      if (uploadErrors.length > 0) {
        setSubmitError('تم إنشاء الطلب لكن حدث خطأ في رفع بعض المستندات.');
      }

      try {
        await serviceOrdersAPI.submit(orderId);
      } catch (submitError) {
        console.log('Submit endpoint not available');
      }

      setStep(4);
    } catch (error) {
      console.error('Error submitting order:', error);
      const msg = error?.response?.data?.detail || error?.response?.data?.message || error?.message || 'حدث خطأ في تقديم الطلب.';
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    onSubmitSuccess?.();
  };

  const steps = [
    { number: 1, title: 'المعلومات الشخصية', icon: User },
    { number: 2, title: 'رفع المستندات', icon: FileText },
    { number: 3, title: 'المراجعة والإرسال', icon: CheckCircle },
    { number: 4, title: 'تم الإرسال', icon: PartyPopper }
  ];

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-white">
      <Header activeSection="services" onNavigate={() => {}} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              {step <= 3 ? (
                <>
                  <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">طلب خدمة</h2>
                    <p className="text-sm text-slate-500">{service.title}</p>
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-slate-900">تم تقديم الطلب</h2>
                  <p className="text-sm text-slate-500">{service.title}</p>
                </div>
              )}
            </div>
            {step <= 3 && (
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            )}
          </div>

          {step <= 3 && (
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                {steps.map((s, index) => {
                  const Icon = s.icon;
                  const isActive = step === s.number;
                  const isCompleted = step > s.number;

                  return (
                    <div key={s.number} className="flex items-center flex-1">
                      <div className={`flex items-center gap-3 ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' :
                          isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <span className={`text-sm font-semibold hidden md:block ${isActive ? 'text-blue-600' : ''}`}>
                          {s.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-4 rounded ${step > s.number ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    المعلومات الشخصية
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">الاسم الكامل *</label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => { setFormData({ ...formData, full_name: e.target.value }); clearFieldError('full_name'); }}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.full_name ? 'border-red-300 bg-red-50' : 'border-slate-300'
                        }`}
                        placeholder="الاسم الرباعي"
                      />
                      {errors.full_name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.full_name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">البريد الإلكتروني *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => { setFormData({ ...formData, email: e.target.value }); clearFieldError('email'); }}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'
                        }`}
                        placeholder="example@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">رقم الهاتف *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); clearFieldError('phone'); }}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-300'
                        }`}
                        placeholder="+970 5X XXX XXXX"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">الجامعة *</label>
                      <input
                        type="text"
                        value={formData.university}
                        onChange={(e) => { setFormData({ ...formData, university: e.target.value }); clearFieldError('university'); }}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.university ? 'border-red-300 bg-red-50' : 'border-slate-300'
                        }`}
                        placeholder="اسم الجامعة"
                      />
                      {errors.university && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.university}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">التخصص *</label>
                      <input
                        type="text"
                        value={formData.field_of_study}
                        onChange={(e) => { setFormData({ ...formData, field_of_study: e.target.value }); clearFieldError('field_of_study'); }}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.field_of_study ? 'border-red-300 bg-red-50' : 'border-slate-300'
                        }`}
                        placeholder="مثال: هندسة حاسوب"
                      />
                      {errors.field_of_study && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.field_of_study}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">سنة التخرج</label>
                      <input
                        type="number"
                        value={formData.graduation_year}
                        onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="2024"
                        min="1990"
                        max="2030"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">المعدل التراكمي</label>
                      <input
                        type="text"
                        value={formData.gpa}
                        onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="مثال: 3.75/4.0"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    المستندات المطلوبة
                  </h3>

                  <p className="text-sm text-slate-600 bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <AlertCircle className="w-4 h-4 inline ml-2 text-blue-600" />
                    الحد الأقصى لحجم كل ملف هو 10MB. صيغ الملفات المقبولة: PDF, JPG, PNG, DOC, DOCX
                  </p>

                  {service.service_type === 'cv' && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`relative border-2 rounded-xl p-4 transition-all ${
                        errors.old_cv ? 'border-red-300 bg-red-50' :
                        formData.old_cv ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-300'
                      }`}>
                        <input
                          ref={(el) => { fileInputRefs.current.old_cv = el; }}
                          type="file"
                          onChange={(e) => handleFileChange('old_cv', e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              errors.old_cv ? 'bg-red-100 text-red-600' :
                              formData.old_cv ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <Upload className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">السيرة الذاتية القديمة</p>
                              <span className="text-xs text-red-500">مطلوب *</span>
                            </div>
                          </div>
                          {formData.old_cv && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveFile('old_cv'); }}
                              className="pointer-events-auto p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-400 hover:text-red-600 z-20 relative"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {!formData.old_cv && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 pointer-events-none">
                            <Upload className="w-3.5 h-3.5" />
                            <span>اضغط للرفع أو اسحب الملف هنا</span>
                          </div>
                        )}
                        {errors.old_cv && (
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.old_cv}
                          </p>
                        )}
                        {formData.old_cv && (
                          <div className="flex items-center gap-2 mt-2 pointer-events-none">
                            {uploadProgress.old_cv === 'uploading' && <Loader className="w-4 h-4 text-blue-600 animate-spin" />}
                            {uploadProgress.old_cv === 'uploaded' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                            <p className="text-xs text-slate-600 truncate">{formData.old_cv?.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {service.service_type === 'cover_letter' && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`relative border-2 rounded-xl p-4 transition-all ${
                        errors.cv_file ? 'border-red-300 bg-red-50' :
                        formData.cv_file ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-300'
                      }`}>
                        <input
                          ref={(el) => { fileInputRefs.current.cv_file = el; }}
                          type="file"
                          onChange={(e) => handleFileChange('cv_file', e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              errors.cv_file ? 'bg-red-100 text-red-600' :
                              formData.cv_file ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">السيرة الذاتية</p>
                              <span className="text-xs text-red-500">مطلوب *</span>
                            </div>
                          </div>
                          {formData.cv_file && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveFile('cv_file'); }}
                              className="pointer-events-auto p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-400 hover:text-red-600 z-20 relative"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {!formData.cv_file && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 pointer-events-none">
                            <Upload className="w-3.5 h-3.5" />
                            <span>اضغط للرفع أو اسحب الملف هنا</span>
                          </div>
                        )}
                        {errors.cv_file && (
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.cv_file}
                          </p>
                        )}
                        {formData.cv_file && (
                          <div className="flex items-center gap-2 mt-2 pointer-events-none">
                            {uploadProgress.cv_file === 'uploading' && <Loader className="w-4 h-4 text-blue-600 animate-spin" />}
                            {uploadProgress.cv_file === 'uploaded' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                            <p className="text-xs text-slate-600 truncate">{formData.cv_file?.name}</p>
                          </div>
                        )}
                      </div>

                      <div className={`relative border-2 rounded-xl p-4 transition-all ${
                        errors.job_description ? 'border-red-300 bg-red-50' :
                        formData.job_description ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-300'
                      }`}>
                        <input
                          ref={(el) => { fileInputRefs.current.job_description = el; }}
                          type="file"
                          onChange={(e) => handleFileChange('job_description', e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              errors.job_description ? 'bg-red-100 text-red-600' :
                              formData.job_description ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">وصف الوظيفة/المنحة</p>
                              <span className="text-xs text-red-500">مطلوب *</span>
                            </div>
                          </div>
                          {formData.job_description && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveFile('job_description'); }}
                              className="pointer-events-auto p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-400 hover:text-red-600 z-20 relative"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {!formData.job_description && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 pointer-events-none">
                            <Upload className="w-3.5 h-3.5" />
                            <span>اضغط للرفع أو اسحب الملف هنا</span>
                          </div>
                        )}
                        {errors.job_description && (
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.job_description}
                          </p>
                        )}
                        {formData.job_description && (
                          <div className="flex items-center gap-2 mt-2 pointer-events-none">
                            {uploadProgress.job_description === 'uploading' && <Loader className="w-4 h-4 text-blue-600 animate-spin" />}
                            {uploadProgress.job_description === 'uploaded' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                            <p className="text-xs text-slate-600 truncate">{formData.job_description?.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">ملاحظات إضافية (اختياري)</label>
                    <textarea
                      value={formData.additional_info}
                      onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="أي معلومات إضافية تود مشاركتها..."
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    مراجعة الطلب قبل الإرسال
                  </h3>

                  <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                    <h4 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">المعلومات الشخصية</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">الاسم الكامل</p>
                        <p className="text-sm font-semibold text-slate-800">{formData.full_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">البريد الإلكتروني</p>
                        <p className="text-sm font-semibold text-slate-800">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">رقم الهاتف</p>
                        <p className="text-sm font-semibold text-slate-800">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">الجامعة</p>
                        <p className="text-sm font-semibold text-slate-800">{formData.university}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">التخصص</p>
                        <p className="text-sm font-semibold text-slate-800">{formData.field_of_study}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">سنة التخرج</p>
                        <p className="text-sm font-semibold text-slate-800">{formData.graduation_year || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                    <h4 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">الملفات المرفقة</h4>
                    {service.service_type === 'cv' && formData.old_cv && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-slate-800 font-medium">السيرة الذاتية القديمة</span>
                        <span className="text-slate-500 text-xs truncate">({formData.old_cv.name})</span>
                      </div>
                    )}
                    {service.service_type === 'cover_letter' && (
                      <>
                        {formData.cv_file && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-slate-800 font-medium">السيرة الذاتية</span>
                            <span className="text-slate-500 text-xs truncate">({formData.cv_file.name})</span>
                          </div>
                        )}
                        {formData.job_description && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-slate-800 font-medium">وصف الوظيفة/المنحة</span>
                            <span className="text-slate-500 text-xs truncate">({formData.job_description.name})</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{submitError}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <PartyPopper className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">تم تقديم طلبك بنجاح!</h3>
                    <p className="text-slate-600">سيتم التواصل معك عبر البريد الإلكتروني أو الهاتف لمتابعة الإجراءات التالية.</p>
                  </div>

                  {submitError && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-700 text-right">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSuccessClose}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                  >
                    العودة
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step <= 3 && (
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex items-center justify-between gap-4">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  السابق
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 max-w-xs py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 max-w-xs py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>تقديم الطلب</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ServiceOrderForm;
