import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  CreditCard,
  FileText,
  Loader,
  PartyPopper,
  Upload,
  User,
  X,
} from 'lucide-react';
import { serviceOrdersAPI } from '../services/api';

const ACCEPTED_DOCUMENT_TYPES = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
const ACCEPTED_RECEIPT_TYPES = ['.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const SERVICE_COPY = {
  cv: {
    title: 'طلب سيرة ذاتية احترافية',
    subtitle: 'أدخل معلوماتك وسنجهز لك سيرة مناسبة للمنح والجامعات.',
    detailsTitle: 'تفاصيل السيرة الذاتية',
    goalLabel: 'ما الهدف من السيرة؟',
    goalPlaceholder: 'مثال: التقديم لمنح ماجستير، جامعة معينة، تدريب، أو فرصة عمل...',
    targetLabel: 'المنحة أو المجال المستهدف',
    targetPlaceholder: 'مثال: منح تركيا، Erasmus، هندسة حاسوب...',
    optionalFileTitle: 'سيرة حالية إن وجدت',
    optionalFileHint: 'اختياري، مش ضروري ترفع سيرة قديمة.',
  },
  cover_letter: {
    title: 'طلب رسالة تحفيز',
    subtitle: 'أعطنا تفاصيل الفرصة حتى نكتب رسالة تحفيز مخصصة ومقنعة.',
    detailsTitle: 'تفاصيل رسالة التحفيز',
    goalLabel: 'لماذا تريد هذه الرسالة؟',
    goalPlaceholder: 'اكتب هدفك من الرسالة وأهم النقاط التي تريد إبرازها...',
    targetLabel: 'اسم المنحة أو الجامعة المستهدفة',
    targetPlaceholder: 'مثال: Erasmus Mundus، جامعة قطر، منحة تركيا...',
    optionalFileTitle: 'CV أو ملف داعم إن وجد',
    optionalFileHint: 'اختياري، يساعدنا فقط على تخصيص الرسالة بشكل أفضل.',
  },
};

function ServiceOrderForm({ service, onClose, onSubmitSuccess }) {
  const fileInputRefs = useRef({});
  const copy = SERVICE_COPY[service?.service_type] || {
    title: 'طلب خدمة',
    subtitle: 'أدخل بياناتك وسنراجع الطلب ونتواصل معك.',
    detailsTitle: 'تفاصيل الخدمة',
    goalLabel: 'اشرح ما تحتاجه',
    goalPlaceholder: 'اكتب التفاصيل التي تساعدنا على تنفيذ الخدمة...',
    targetLabel: 'الهدف أو الجهة المستهدفة',
    targetPlaceholder: 'مثال: منحة، جامعة، تخصص، أو موعد نهائي...',
    optionalFileTitle: 'ملف داعم إن وجد',
    optionalFileHint: 'اختياري.',
  };

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitNotice, setSubmitNotice] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    university: '',
    field_of_study: '',
    graduation_year: '',
    gpa: '',
    service_goal: '',
    target_name: '',
    deadline: '',
    preferred_language: 'العربية',
    additional_info: '',
    optional_document: null,
    payment_receipt: null,
    transaction_id: '',
  });

  const steps = [
    { number: 1, title: 'المعلومات الشخصية', icon: User },
    { number: 2, title: 'تفاصيل الخدمة', icon: FileText },
    { number: 3, title: 'المراجعة والدفع', icon: CreditCard },
    { number: 4, title: 'تم الإرسال', icon: PartyPopper },
  ];

  const clearFieldError = (field) => {
    if (!errors[field]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const validateStep1 = () => {
    const nextErrors = {};
    if (!formData.full_name.trim()) nextErrors.full_name = 'الاسم الكامل مطلوب';
    if (!formData.email.trim()) nextErrors.email = 'البريد الإلكتروني مطلوب';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = 'البريد الإلكتروني غير صحيح';
    if (!formData.phone.trim()) nextErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.university.trim()) nextErrors.university = 'اسم الجامعة أو المؤسسة مطلوب';
    if (!formData.field_of_study.trim()) nextErrors.field_of_study = 'التخصص أو المجال مطلوب';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors = {};
    if (!formData.service_goal.trim()) nextErrors.service_goal = 'اكتب تفاصيل الطلب حتى نقدر نجهزه بشكل صحيح';
    if (service?.service_type === 'cover_letter' && !formData.target_name.trim()) {
      nextErrors.target_name = 'اسم المنحة أو الجهة المستهدفة مطلوب لرسالة التحفيز';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep((current) => current - 1);
  };

  const validateFile = (field, file, acceptedTypes) => {
    if (!file) return false;

    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, [field]: 'حجم الملف يجب أن لا يتجاوز 10MB' }));
      return false;
    }

    if (!acceptedTypes.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      setErrors((prev) => ({ ...prev, [field]: 'صيغة الملف غير مقبولة' }));
      return false;
    }

    return true;
  };

  const handleFileChange = (field, file, acceptedTypes = ACCEPTED_DOCUMENT_TYPES) => {
    if (!validateFile(field, file, acceptedTypes)) return;
    updateField(field, file);
  };

  const handleRemoveFile = (field) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    setUploadProgress((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (fileInputRefs.current[field]) fileInputRefs.current[field].value = '';
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitNotice('');

    try {
      const serviceDetails = {
        service_type: service?.service_type,
        service_goal: formData.service_goal,
        target_name: formData.target_name,
        deadline: formData.deadline,
        preferred_language: formData.preferred_language,
        additional_info: formData.additional_info,
      };

      const response = await serviceOrdersAPI.create({
        service: service.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        university: formData.university,
        field_of_study: formData.field_of_study,
        graduation_year: formData.graduation_year || null,
        gpa: formData.gpa,
        notes: formData.additional_info,
        service_details: serviceDetails,
        payment_method: 'palpay',
        transaction_id: formData.transaction_id,
      });

      const orderId = response.data?.id;
      if (!orderId) throw new Error('لم يتم إرجاع رقم الطلب من الخادم');

      const uploadErrors = [];

      if (formData.optional_document) {
        setUploadProgress((prev) => ({ ...prev, optional_document: 'uploading' }));
        try {
          await serviceOrdersAPI.uploadDocument(orderId, formData.optional_document, 'supporting_document');
          setUploadProgress((prev) => ({ ...prev, optional_document: 'uploaded' }));
        } catch (error) {
          console.error('Error uploading supporting document:', error);
          setUploadProgress((prev) => ({ ...prev, optional_document: 'error' }));
          uploadErrors.push('optional_document');
        }
      }

      if (formData.payment_receipt) {
        setUploadProgress((prev) => ({ ...prev, payment_receipt: 'uploading' }));
        try {
          await serviceOrdersAPI.uploadReceipt(orderId, formData.payment_receipt);
          setUploadProgress((prev) => ({ ...prev, payment_receipt: 'uploaded' }));
        } catch (error) {
          console.error('Error uploading payment receipt:', error);
          setUploadProgress((prev) => ({ ...prev, payment_receipt: 'error' }));
          uploadErrors.push('payment_receipt');
        }
      }

      await serviceOrdersAPI.submit(orderId);

      if (uploadErrors.length > 0) {
        setSubmitNotice('تم إنشاء الطلب، لكن تعذر رفع بعض الملفات. يمكنك إرسالها لاحقا عبر صفحة التواصل أو واتساب.');
      }

      setStep(4);
    } catch (error) {
      console.error('Error submitting service order:', error);
      const message = error?.response?.data?.detail
        || error?.response?.data?.message
        || error?.message
        || 'حدث خطأ في تقديم الطلب. حاول مرة أخرى.';
      setSubmitNotice(message);
    } finally {
      setLoading(false);
    }
  };

  const closeSuccess = () => {
    onSubmitSuccess?.();
    onClose?.();
  };

  const FileUploadBox = ({
    field,
    title,
    hint,
    icon: Icon,
    acceptedTypes = ACCEPTED_DOCUMENT_TYPES,
    required = false,
  }) => {
    const file = formData[field];
    const status = uploadProgress[field];

    return (
      <div
        className={`relative rounded-2xl border-2 p-4 transition-all ${
          errors[field]
            ? 'border-red-300 bg-red-50'
            : file
              ? 'border-emerald-300 bg-emerald-50'
              : 'border-slate-200 bg-white hover:border-blue-300'
        }`}
      >
        <input
          ref={(el) => { fileInputRefs.current[field] = el; }}
          type="file"
          onChange={(event) => handleFileChange(field, event.target.files[0], acceptedTypes)}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          accept={acceptedTypes.join(',')}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                file ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">{title}</p>
              <p className={`text-xs mt-0.5 ${required ? 'text-red-500' : 'text-slate-500'}`}>
                {required ? 'مطلوب' : hint}
              </p>
            </div>
          </div>

          {file && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleRemoveFile(field);
              }}
              className="pointer-events-auto relative z-20 p-1.5 hover:bg-red-100 rounded-lg text-red-400 hover:text-red-600 transition-colors"
              aria-label="حذف الملف"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {file ? (
          <div className="mt-3 flex items-center gap-2 min-w-0">
            {status === 'uploading' && <Loader className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />}
            {status === 'uploaded' && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            {status === 'error' && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
            <p className="text-xs text-slate-600 truncate">{file.name}</p>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 pointer-events-none">
            <Upload className="w-3.5 h-3.5" />
            <span>اضغط للرفع أو اسحب الملف هنا</span>
          </div>
        )}

        {errors[field] && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(event) => event.stopPropagation()}
        className="soft-scrollbar bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between gap-4 z-10">
          <div className="min-w-0">
            <p className="text-xs font-bold text-blue-600 mb-1">خدماتنا</p>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{copy.title}</h2>
            <p className="text-sm text-slate-500 truncate">{service?.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {step <= 3 && (
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/70">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {steps.slice(0, 3).map((item) => {
                const Icon = item.icon;
                const isActive = step === item.number;
                const isDone = step > item.number;

                return (
                  <div key={item.number} className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-right">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-white border border-slate-200 text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs sm:text-sm font-bold ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-4 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                  <h3 className="text-base font-bold text-slate-900 mb-1">{copy.title}</h3>
                  <p className="text-sm text-slate-600 leading-6">{copy.subtitle}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    المعلومات الشخصية والأكاديمية
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      label="الاسم الكامل"
                      required
                      value={formData.full_name}
                      error={errors.full_name}
                      onChange={(value) => updateField('full_name', value)}
                      placeholder="الاسم الرباعي"
                    />
                    <Field
                      label="البريد الإلكتروني"
                      required
                      type="email"
                      value={formData.email}
                      error={errors.email}
                      onChange={(value) => updateField('email', value)}
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                    <Field
                      label="رقم الهاتف"
                      required
                      type="tel"
                      value={formData.phone}
                      error={errors.phone}
                      onChange={(value) => updateField('phone', value)}
                      placeholder="+970 5X XXX XXXX"
                      dir="ltr"
                    />
                    <Field
                      label="الجامعة أو المؤسسة"
                      required
                      value={formData.university}
                      error={errors.university}
                      onChange={(value) => updateField('university', value)}
                      placeholder="اسم الجامعة"
                    />
                    <Field
                      label="التخصص أو المجال"
                      required
                      value={formData.field_of_study}
                      error={errors.field_of_study}
                      onChange={(value) => updateField('field_of_study', value)}
                      placeholder="مثال: هندسة حاسوب"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="سنة التخرج"
                        type="number"
                        value={formData.graduation_year}
                        onChange={(value) => updateField('graduation_year', value)}
                        placeholder="2026"
                      />
                      <Field
                        label="المعدل"
                        value={formData.gpa}
                        onChange={(value) => updateField('gpa', value)}
                        placeholder="3.75/4"
                      />
                    </div>
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
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {copy.detailsTitle}
                </h3>

                <TextAreaField
                  label={copy.goalLabel}
                  required
                  value={formData.service_goal}
                  error={errors.service_goal}
                  onChange={(value) => updateField('service_goal', value)}
                  placeholder={copy.goalPlaceholder}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label={copy.targetLabel}
                    required={service?.service_type === 'cover_letter'}
                    value={formData.target_name}
                    error={errors.target_name}
                    onChange={(value) => updateField('target_name', value)}
                    placeholder={copy.targetPlaceholder}
                  />
                  <Field
                    label="الموعد النهائي إن وجد"
                    type="date"
                    value={formData.deadline}
                    onChange={(value) => updateField('deadline', value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">لغة الملف المطلوبة</label>
                    <select
                      value={formData.preferred_language}
                      onChange={(event) => updateField('preferred_language', event.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                    >
                      <option value="العربية">العربية</option>
                      <option value="الإنجليزية">الإنجليزية</option>
                      <option value="العربية والإنجليزية">العربية والإنجليزية</option>
                    </select>
                  </div>
                  <FileUploadBox
                    field="optional_document"
                    title={copy.optionalFileTitle}
                    hint={copy.optionalFileHint}
                    icon={BookOpen}
                  />
                </div>

                <TextAreaField
                  label="ملاحظات إضافية"
                  value={formData.additional_info}
                  onChange={(value) => updateField('additional_info', value)}
                  placeholder="أي تفاصيل إضافية، إنجازات مهمة، روابط، أو تعليمات خاصة..."
                  rows={3}
                />
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
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  المراجعة والدفع
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">ملخص الطلب</h4>
                    <ReviewRow label="الخدمة" value={service?.title} />
                    <ReviewRow label="الاسم" value={formData.full_name} />
                    <ReviewRow label="البريد" value={formData.email} />
                    <ReviewRow label="الهاتف" value={formData.phone} />
                    <ReviewRow label="الهدف" value={formData.target_name || 'غير محدد'} />
                    <ReviewRow label="اللغة" value={formData.preferred_language} />
                  </div>

                  <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      بيانات الدفع
                    </h4>
                    <p className="text-sm text-slate-600 leading-6 mb-4">
                      يمكنك رفع إيصال الدفع الآن أو إرسال الطلب وسيتم التواصل معك لإكمال الدفع.
                    </p>
                    <Field
                      label="رقم العملية إن وجد"
                      value={formData.transaction_id}
                      onChange={(value) => updateField('transaction_id', value)}
                      placeholder="Transaction ID"
                      dir="ltr"
                    />
                  </div>
                </div>

                <FileUploadBox
                  field="payment_receipt"
                  title="إيصال الدفع"
                  hint="اختياري الآن، صيغة JPG أو PNG"
                  icon={Upload}
                  acceptedTypes={ACCEPTED_RECEIPT_TYPES}
                />

                {submitNotice && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{submitNotice}</p>
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
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">تم تقديم طلبك بنجاح</h3>
                  <p className="text-slate-600 leading-7 max-w-lg mx-auto">
                    وصلنا طلب الخدمة، وسيتم التواصل معك عبر البريد الإلكتروني أو الهاتف لمتابعة التفاصيل.
                  </p>
                </div>

                {submitNotice && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700 text-right">{submitNotice}</p>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={closeSuccess}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  العودة
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step <= 3 && (
          <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 sm:p-6 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                السابق
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 max-w-xs py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                التالي
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 max-w-xs py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    تقديم الطلب
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

function Field({
  label,
  value,
  onChange,
  error,
  required = false,
  type = 'text',
  placeholder = '',
  dir,
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
        }`}
        placeholder={placeholder}
        dir={dir}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  rows = 4,
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
          error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
        }`}
        placeholder={placeholder}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-200 last:border-b-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800 text-left break-words">{value || '-'}</span>
    </div>
  );
}

export default ServiceOrderForm;
