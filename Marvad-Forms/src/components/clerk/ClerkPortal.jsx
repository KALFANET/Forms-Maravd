import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { auth } from '../../firebase-config';
import { sendOTP, initializeRecaptcha } from '../../services/sms';
import { validateIsraeliID } from '../../utils/idValidation';

const ClerkPortal = () => {
  const [formData, setFormData] = useState({
    idNumber: '',
    firstName: '',
    lastName: '',
    phone: '',
    referralReason: '',
    branch: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialize Firebase reCAPTCHA on component mount
    initializeRecaptcha();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateIsraeliID(formData.idNumber)) {
      newErrors.idNumber = 'מספר זהות לא תקין';
    }
    if (!/^05\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'מספר טלפון לא תקין';
    }
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'שדה חובה';
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'שדה חובה';
    }
    if (!formData.referralReason) {
      newErrors.referralReason = 'יש לבחור סיבת הפניה';
    }
    if (!formData.branch) {
      newErrors.branch = 'יש לבחור סניף';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      // יצירת מזהה ייחודי לטופס
      const formId = crypto.randomUUID();
      
      // שליחת OTP לטלפון של האזרח
      const otpSent = await sendOTP(formData.phone);
      
      if (!otpSent) {
        throw new Error('שגיאה בשליחת קוד האימות');
      }

      // שמירת הנתונים ב-Firebase (בפרויקט אמיתי)
      const formLink = `https://your-domain.com/forms/${formId}`;
      
      setFeedback({
        type: 'success',
        message: `קישור לטופס נשלח בהצלחה למספר ${formData.phone}`,
        details: {
          formId,
          link: formLink
        }
      });

      // איפוס הטופס
      setFormData({
        idNumber: '',
        firstName: '',
        lastName: '',
        phone: '',
        referralReason: '',
        branch: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      setFeedback({
        type: 'error',
        message: 'אירעה שגיאה בשליחת הטופס: ' + error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">פורטל פקיד - הפניה למכון רפואי</h1>
          <p className="text-sm text-gray-500">משרד התחבורה והבטיחות בדרכים</p>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          {/* פרטים אישיים */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">שם משפחה</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={e => setFormData(prev => ({...prev, lastName: e.target.value}))}
                className={`w-full p-2 border rounded-md ${errors.lastName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">{errors.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">שם פרטי</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={e => setFormData(prev => ({...prev, firstName: e.target.value}))}
                className={`w-full p-2 border rounded-md ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">{errors.firstName}</p>
              )}
            </div>
          </div>

          {/* מספרי זיהוי */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">מספר תעודת זהות</label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={e => setFormData(prev => ({...prev, idNumber: e.target.value}))}
                maxLength={9}
                className={`w-full p-2 border rounded-md ${errors.idNumber ? 'border-red-500' : ''}`}
              />
              {errors.idNumber && (
                <p className="text-red-500 text-xs">{errors.idNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">טלפון נייד</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData(prev => ({...prev, phone: e.target.value}))}
                className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : ''}`}
                dir="ltr"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* פרטי ההפניה */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">סיבת ההפניה</label>
              <select
                value={formData.referralReason}
                onChange={e => setFormData(prev => ({...prev, referralReason: e.target.value}))}
                className={`w-full p-2 border rounded-md ${errors.referralReason ? 'border-red-500' : ''}`}
              >
                <option value="">בחר סיבת הפניה</option>
                <option value="age">גיל (מעל 70)</option>
                <option value="medical">מצב רפואי</option>
                <option value="accident">מעורבות בתאונת דרכים</option>
                <option value="vision">בעיות ראייה</option>
                <option value="renewal">חידוש רישיון</option>
              </select>
              {errors.referralReason && (
                <p className="text-red-500 text-xs">{errors.referralReason}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">סניף</label>
              <select
                value={formData.branch}
                onChange={e => setFormData(prev => ({...prev, branch: e.target.value}))}
                className={`w-full p-2 border rounded-md ${errors.branch ? 'border-red-500' : ''}`}
              >
                <option value="">בחר סניף</option>
                <option value="TLV">תל אביב</option>
                <option value="JLM">ירושלים</option>
                <option value="HFA">חיפה</option>
                <option value="BSH">באר שבע</option>
              </select>
              {errors.branch && (
                <p className="text-red-500 text-xs">{errors.branch}</p>
              )}
            </div>
          </div>

          {/* Recaptcha container */}
          <div id="recaptcha-container"></div>

          {/* הודעות משוב */}
          {feedback && (
            <Alert className={feedback.type === 'success' ? 'bg-green-50' : 'bg-red-50'}>
              {feedback.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription>
                {feedback.message}
              </AlertDescription>
            </Alert>
          )}

          {/* כפתורי פעולה */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  idNumber: '',
                  firstName: '',
                  lastName: '',
                  phone: '',
                  referralReason: '',
                  branch: ''
                });
                setErrors({});
                setFeedback(null);
              }}
            >
              נקה טופס
            </Button>
            
            <Button
              type="submit"
              disabled={isProcessing}
              className="bg-blue-600"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  שולח...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  שלח טופס
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClerkPortal;