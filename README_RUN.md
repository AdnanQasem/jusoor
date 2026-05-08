# دليل التشغيل السريع - AmDist Platform

## 🚀 تشغيل المشروع بالكامل

### 1. تشغيل Django Backend (Terminal 1)

```powershell
cd C:\Users\AdnanQasem\Documents\Emidiest\amdist\backend
..\venv\Scripts\activate
python manage.py runserver
```

**يجب أن يظهر:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### 2. تشغيل React Frontend (Terminal 2)

```powershell
cd C:\Users\AdnanQasem\Documents\Emidiest\amdist
npm run dev
```

**يجب أن يظهر:**
```
VITE v5.1.0  ready in 1017 ms
➜  Local:   http://localhost:5176/
```

### 3. فتح المتصفح

افتح: **http://localhost:5176**

---

## 🔍 حل المشاكل الشائعة

### المشكلة: صفحة بيضاء

**الحل:**
1. تأكد إن الـ Backend شغال (Terminal 1)
2. افتح Console في المتصفح (F12)
3. شوف إذا في أخطاء حمراء

### المشكلة: CORS Error

**الحل:**
تأكد من وجود هذا الكود في `backend/amdist_backend/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
]
```

### المشكلة: Cannot connect to backend

**الحل:**
- تأكد إن الـ Django server شغال على البورت 8000
- جرب تفتح: http://localhost:8000/api/
- إذا ما اشتغل، أعد تشغيل الـ Backend

---

## 📝 بيانات دخول Admin

- **الرابط:** http://localhost:8000/admin/
- **Username:** admin
- **Password:** admin123

---

## 🧪 اختبار الـ API

افتح في المتصفح:
- http://localhost:8000/api/scholarships/
- http://localhost:8000/api/services/
- http://localhost:8000/api/faq/

إذا ظهرت بيانات JSON، فالـ Backend شغال صح ✅
