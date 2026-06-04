import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { applicationsAPI } from '../services/api';
import {
  X, Upload, User, Mail, Phone, Calendar, GraduationCap,
  FileText, CheckCircle, AlertCircle, Loader, ArrowLeft,
  BookOpen, Award, Globe, FileCheck, CreditCard, Trash2, PartyPopper
} from 'lucide-react';

function ApplicationForm({ scholarship, onClose, onSubmitSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRefs = useRef({});
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    nationality: '',
    gender: 'male',
    education_level: '',
    gpa: '',
    university: '',
    graduation_year: '',
    field_of_study: '',
    cv: null,
    transcript: null,
    language_certificate: null,
    recommendation_letters: null,
    motivation_letter: null,
    passport_copy: null,
    payment_receipt: null,
    additional_comments: ''
  });

  const [errors, setErrors] = useState({});

  const ACCEPTED_TYPES = ['.pdf', '.jpg', '.jpeg', '.png'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const getAcceptedExtensionsStr = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return ACCEPTED_TYPES.includes(`.${ext}`);
  };

  const getErrorMessage = (error, fallbackMessage) => {
    const data = error?.response?.data;

    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    if (data?.detail) {
      return data.detail;
    }

    if (data?.message) {
      return data.message;
    }

    if (data && typeof data === 'object') {
      const fieldMessage = Object.entries(data)
        .map(([field, value]) => {
          const text = Array.isArray(value) ? value.join(', ') : String(value);
          return `${field}: ${text}`;
        })
        .join(' | ');

      if (fieldMessage) {
        return fieldMessage;
      }
    }

    return error?.message || fallbackMessage;
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'الاسم الكامل مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صحيح';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'تاريخ الميلاد مطلوب';
    if (!formData.nationality.trim()) newErrors.nationality = 'الجنسية مطلوبة';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.education_level) newErrors.education_level = 'المستوى التعليمي الحالي مطلوب';
    if (!formData.gpa) newErrors.gpa = 'المعدل التراكمي مطلوب';
    if (!formData.field_of_study.trim()) newErrors.field_of_study = 'التخصص مطلوب';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    const requiredDocs = [
      { key: 'cv', label: 'السيرة الذاتية (CV)' },
      { key: 'transcript', label: 'كشف العلامات' },
      { key: 'passport_copy', label: 'نسخة من جواز السفر' }
    ];

    for (const doc of requiredDocs) {
      if (!formData[doc.key]) {
        newErrors[doc.key] = `${doc.label} مطلوب`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.payment_receipt || !(formData.payment_receipt instanceof File)) {
      newErrors.payment_receipt = 'إيصال الدفع مطلوب';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    } else if (step === 4 && validateStep4()) {
      setStep(5);
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

    if (!getAcceptedExtensionsStr(file.name)) {
      setErrors(prev => ({ ...prev, [field]: 'صيغة الملف غير مقبولة. المقبولة: PDF, JPG, PNG' }));
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
      // First create the application with basic data
      const applicationData = {
        scholarship: scholarship.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        nationality: formData.nationality,
        gender: formData.gender,
        education_level: formData.education_level,
        gpa: formData.gpa,
        university: formData.university || '',
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : new Date().getFullYear(),
        field_of_study: formData.field_of_study,
        additional_comments: formData.additional_comments || ''
      };

      console.log('Submitting application:', applicationData);

      const response = await applicationsAPI.create(applicationData);
      console.log('Application created:', response.data);
      const applicationId = response.data.id;
      if (!applicationId) {
        throw new Error('لم يتم استلام رقم الطلب من الخادم. يرجى المحاولة مرة أخرى.');
      }

      // Then upload all documents
      const documents = [
        { field: 'cv', type: 'cv' },
        { field: 'transcript', type: 'transcript' },
        { field: 'language_certificate', type: 'language_certificate' },
        { field: 'recommendation_letters', type: 'recommendation_letters' },
        { field: 'motivation_letter', type: 'motivation_letter' },
        { field: 'passport_copy', type: 'passport_copy' }
      ];

      let uploadErrors = [];
      for (const doc of documents) {
        if (formData[doc.field]) {
          setUploadProgress(prev => ({ ...prev, [doc.field]: 'uploading' }));
          try {
            await applicationsAPI.uploadDocument(applicationId, formData[doc.field], doc.type);
            setUploadProgress(prev => ({ ...prev, [doc.field]: 'uploaded' }));
          } catch (error) {
            console.error(`Error uploading ${doc.field}:`, error);
            setUploadProgress(prev => ({ ...prev, [doc.field]: 'error' }));
            uploadErrors.push(doc.field);
          }
        }
      }

      // Upload payment receipt
      if (formData.payment_receipt) {
        setUploadProgress(prev => ({ ...prev, payment_receipt: 'uploading' }));
        try {
          await applicationsAPI.uploadReceipt(applicationId, formData.payment_receipt);
          setUploadProgress(prev => ({ ...prev, payment_receipt: 'uploaded' }));
        } catch (error) {
          console.error(`Error uploading payment receipt:`, error);
          setUploadProgress(prev => ({ ...prev, payment_receipt: 'error' }));
          uploadErrors.push('payment_receipt');
        }
      }

      if (uploadErrors.length > 0) {
        setSubmitError('تم إنشاء الطلب لكن حدث خطأ في رفع بعض المستندات. يمكنك إعادة رفعها لاحقاً.');
        setStep(6);
        return;
      }

      // Submit the application (if backend has a submit endpoint)
      try {
        await applicationsAPI.submit(applicationId);
      } catch (submitError) {
        console.log('Submit endpoint not available, application created but not submitted');
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        setStep(6);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      console.error('Error response:', error?.response?.data);
      const msg = error?.response?.data?.detail || error?.response?.data?.message || error?.message || 'حدث خطأ في تقديم الطلب. يرجى المحاولة مرة أخرى.';
      setSubmitError(getErrorMessage(error, msg));
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    onSubmitSuccess?.();
  };

  const educationLevelLabels = {
    bachelor: 'بكالوريوس',
    master: 'ماجستير',
    phd: 'دكتوراه'
  };

  const genderLabels = {
    male: 'ذكر',
    female: 'أنثى'
  };

  const steps = [
    { number: 1, title: 'المعلومات الشخصية', icon: User },
    { number: 2, title: 'المعلومات الأكاديمية', icon: GraduationCap },
    { number: 3, title: 'رفع المستندات', icon: FileText },
    { number: 4, title: 'إيصال الدفع', icon: CreditCard },
    { number: 5, title: 'المراجعة والإرسال', icon: CheckCircle }
  ];

  return (
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
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            {step <= 4 ? (
              <>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">تقديم طلب للمنحة</h2>
                  <p className="text-sm text-slate-500">{scholarship.title}</p>
                </div>
              </>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-slate-900">تم تقديم الطلب</h2>
                <p className="text-sm text-slate-500">{scholarship.title}</p>
              </div>
            )}
          </div>
          {step <= 4 && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-500" />
            </button>
          )}
        </div>

        {step <= 4 && (
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
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      الاسم الكامل *
                    </label>
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
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      البريد الإلكتروني *
                    </label>
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
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      رقم الهاتف *
                    </label>
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
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      تاريخ الميلاد *
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => { setFormData({ ...formData, date_of_birth: e.target.value }); clearFieldError('date_of_birth'); }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.date_of_birth ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                    {errors.date_of_birth && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.date_of_birth}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      الجنسية *
                    </label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => { setFormData({ ...formData, nationality: e.target.value }); clearFieldError('nationality'); }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.nationality ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="فلسطيني"
                    />
                    {errors.nationality && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.nationality}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      الجنس
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
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
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  المعلومات الأكاديمية
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      المستوى التعليمي الحالي *
                    </label>
                    <select
                      value={formData.education_level}
                      onChange={(e) => { setFormData({ ...formData, education_level: e.target.value }); clearFieldError('education_level'); }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.education_level ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                    >
                      <option value="">اختر المستوى</option>
                      <option value="tawjihi">توجيهي / ثانوية عامة</option>
                      <option value="bachelor">بكالوريوس</option>
                      <option value="master">ماجستير</option>
                      <option value="phd">دكتوراه</option>
                    </select>
                    {errors.education_level && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.education_level}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      المعدل التراكمي *
                    </label>
                    <input
                      type="text"
                      value={formData.gpa}
                      onChange={(e) => { setFormData({ ...formData, gpa: e.target.value }); clearFieldError('gpa'); }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.gpa ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="مثال: 3.75/4.0 أو 85/100"
                    />
                    {errors.gpa && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.gpa}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      الجامعة / المؤسسة
                    </label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="اسم الجامعة"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      سنة التخرج
                    </label>
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      التخصص *
                    </label>
                    <input
                      type="text"
                      value={formData.field_of_study}
                      onChange={(e) => { setFormData({ ...formData, field_of_study: e.target.value }); clearFieldError('field_of_study'); }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.field_of_study ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="مثال: هندسة حاسوب، طب، إدارة أعمال"
                    />
                    {errors.field_of_study && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.field_of_study}
                      </p>
                    )}
                  </div>
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
                  <FileText className="w-5 h-5 text-blue-600" />
                  المستندات المطلوبة
                </h3>

                <p className="text-sm text-slate-600 bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <AlertCircle className="w-4 h-4 inline ml-2 text-blue-600" />
                  الحد الأقصى لحجم كل ملف هو 10MB. صيغ الملفات المقبولة: PDF, JPG, PNG
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: 'cv', label: 'السيرة الذاتية (CV)', icon: User, required: true },
                    { key: 'transcript', label: 'كشف العلامات', icon: FileCheck, required: true },
                    { key: 'language_certificate', label: 'شهادة اللغة (IELTS/TOEFL)', icon: Globe, required: false },
                    { key: 'recommendation_letters', label: 'رسائل التوصية', icon: Award, required: false },
                    { key: 'motivation_letter', label: 'المقال التحفيزي', icon: BookOpen, required: false },
                    { key: 'passport_copy', label: 'نسخة من جواز السفر', icon: FileText, required: true }
                  ].map((doc) => {
                    const Icon = doc.icon;
                    const hasFile = formData[doc.key] !== null;
                    const uploadStatus = uploadProgress[doc.key];
                    const hasError = errors[doc.key];

                    return (
                      <div
                        key={doc.key}
                        className={`relative border-2 rounded-xl p-4 transition-all ${
                          hasError ? 'border-red-300 bg-red-50' :
                          hasFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          ref={(el) => { fileInputRefs.current[doc.key] = el; }}
                          type="file"
                          onChange={(e) => handleFileChange(doc.key, e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              hasError ? 'bg-red-100 text-red-600' :
                              hasFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{doc.label}</p>
                              {doc.required && (
                                <span className="text-xs text-red-500">مطلوب *</span>
                              )}
                            </div>
                          </div>
                          {hasFile && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveFile(doc.key); }}
                              className="pointer-events-auto p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-400 hover:text-red-600 z-20 relative"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {!hasFile && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 pointer-events-none">
                            <Upload className="w-3.5 h-3.5" />
                            <span>اضغط للرفع أو اسحب الملف هنا</span>
                          </div>
                        )}
                        {hasError && (
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors[doc.key]}
                          </p>
                        )}
                        {hasFile && (
                          <div className="flex items-center gap-2 mt-2 pointer-events-none">
                            {uploadStatus === 'uploading' && <Loader className="w-4 h-4 text-blue-600 animate-spin" />}
                            {uploadStatus === 'uploaded' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                            {uploadStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                            {!uploadStatus && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                            <p className="text-xs text-slate-600 truncate">
                              {formData[doc.key]?.name}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ملاحظات إضافية (اختياري)
                  </label>
                  <textarea
                    value={formData.additional_comments}
                    onChange={(e) => setFormData({ ...formData, additional_comments: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="أي معلومات إضافية تود مشاركتها..."
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 mb-1">ملاحظة:</p>
                      <p className="text-sm text-amber-700">في الخطوة التالية، ستقوم برفع إيصال دفع رسوم التقديم (100₪) بعد استلام رسالة البريد الإلكتروني التي تحتوي على تفاصيل التحويل البنكي.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment Receipt */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  إيصال الدفع
                </h3>

                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-300 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900">إيصال الدفع</h4>
                      <p className="text-xs text-emerald-700">خطوة أساسية لإتمام التقديم</p>
                    </div>
                  </div>

                  <div className={`border-2 rounded-xl p-4 transition-all ${
                    errors.payment_receipt ? 'border-red-300 bg-red-50' :
                    formData.payment_receipt ? 'border-emerald-500 bg-white' : 'border-emerald-300 bg-white'
                  }`}>
                    {!formData.payment_receipt ? (
                      <div className="text-center py-4">
                        <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700 mb-2">اضغط على الزر أدناه لرفع إيصال الدفع</p>
                        <p className="text-xs text-slate-500 mb-3">صورة واضحة من تحويل الرسوم البنكية</p>
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current.payment_receipt?.click()}
                          className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>اختر ملف الإيصال</span>
                        </button>
                        <input
                          ref={(el) => {
                            fileInputRefs.current.payment_receipt = el;
                            if (el && formData.payment_receipt && el.files) {
                              const dataTransfer = new DataTransfer();
                              dataTransfer.items.add(formData.payment_receipt);
                              el.files = dataTransfer.files;
                            }
                          }}
                          type="file"
                          onChange={(e) => handleFileChange('payment_receipt', e.target.files[0])}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">تم رفع الإيصال بنجاح</p>
                            <p className="text-xs text-slate-500 truncate">{formData.payment_receipt.name}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveFile('payment_receipt'); }}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {errors.payment_receipt && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.payment_receipt}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 bg-white/70 rounded-lg p-3 text-xs text-slate-600">
                    <p className="font-semibold mb-1">⚠️ ملاحظة مهمة:</p>
                    <p>يجب رفع صورة واضحة من إيصال دفع رسوم التقديم (100₪). سيتم إرسال تفاصيل التحويل البنكي إلى بريدك الإلكتروني بعد تقديم الطلب.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
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
                      <p className="text-xs text-slate-500 mb-1">تاريخ الميلاد</p>
                      <p className="text-sm font-semibold text-slate-800">{formData.date_of_birth}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">الجنسية</p>
                      <p className="text-sm font-semibold text-slate-800">{formData.nationality}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">الجنس</p>
                      <p className="text-sm font-semibold text-slate-800">{genderLabels[formData.gender] || formData.gender}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">المعلومات الأكاديمية</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">المستوى التعليمي الحالي</p>
                      <p className="text-sm font-semibold text-slate-800">{educationLevelLabels[formData.education_level] || formData.education_level}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">المعدل التراكمي</p>
                      <p className="text-sm font-semibold text-slate-800">{formData.gpa}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">الجامعة</p>
                      <p className="text-sm font-semibold text-slate-800">{formData.university || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">سنة التخرج</p>
                      <p className="text-sm font-semibold text-slate-800">{formData.graduation_year || '—'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-slate-500 mb-1">التخصص</p>
                      <p className="text-sm font-semibold text-slate-800">{formData.field_of_study}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">المستندات المرفقة</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { key: 'cv', label: 'السيرة الذاتية (CV)' },
                      { key: 'transcript', label: 'كشف العلامات' },
                      { key: 'language_certificate', label: 'شهادة اللغة' },
                      { key: 'recommendation_letters', label: 'رسائل التوصية' },
                      { key: 'motivation_letter', label: 'المقال التحفيزي' },
                      { key: 'passport_copy', label: 'نسخة جواز السفر' },
                      { key: 'payment_receipt', label: 'إيصال الدفع' }
                    ].map((doc) => (
                      <div key={doc.key} className="flex items-center gap-2 text-sm">
                        {formData[doc.key] ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-slate-800 font-medium">{doc.label}</span>
                            <span className="text-slate-500 text-xs truncate">({formData[doc.key]?.name})</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-400">{doc.label} — غير مرفق</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Receipt Review */}
                <div className="bg-emerald-50 rounded-xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-emerald-900 border-b border-emerald-200 pb-2 mb-3">إيصال الدفع</h4>
                  <div className="flex items-center gap-3">
                    {formData.payment_receipt ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-800">تم رفع إيصال الدفع</p>
                          <p className="text-xs text-emerald-600 truncate">{formData.payment_receipt.name}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-500 text-sm">إيصال الدفع — غير مرفق</span>
                      </>
                    )}
                  </div>
                </div>

                {formData.additional_comments && (
                  <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                    <h4 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">ملاحظات إضافية</h4>
                    <p className="text-sm text-slate-800">{formData.additional_comments}</p>
                  </div>
                )}

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 mb-1">قبل تقديم الطلب:</p>
                      <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                        <li>تأكد من صحة جميع المعلومات المدخلة</li>
                        <li>تحقق من رفع جميع المستندات المطلوبة</li>
                        <li>تأكد من أن الملفات بصيغة PDF أو صور واضحة</li>
                        <li>تحقق من رفع إيصال دفع رسوم التقديم (100₪)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <p className="text-sm text-emerald-800">
                      <span className="font-bold">ملاحظة:</span> بعد تقديم الطلب، سيتم التواصل معك عبر البريد الإلكتروني أو الهاتف لمتابعة الإجراءات التالية.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
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
                  العودة للمنح
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step <= 5 && (
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

            {step < 5 ? (
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
  );
}

export default ApplicationForm;
