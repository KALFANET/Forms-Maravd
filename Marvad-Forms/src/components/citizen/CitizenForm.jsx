import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Save } from 'lucide-react';

const CitizenForm = ({ formData: initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    ...initialData,
    medicalDocuments: null,
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h1 className="text-2xl font-bold text-center">טופס הפניה למכון הרפואי</h1>
        <p className="text-sm text-gray-500 text-center">משרד התחבורה והבטיחות בדרכים</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          {/* פרטים מזהים - לקריאה בלבד */}
          <div className="bg-gray-50 p-4 rounded-md space-y-4">
            <h2 className="font-medium">פרטים מזהים</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">שם מלא</label>
                <p className="font-medium">{`${initialData.firstName} ${initialData.lastName}`}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">תעודת זהות</label>
                <p className="font-medium">{initialData.idNumber}</p>
              </div>
            </div>
          </div>

          {/* העלאת מסמכים */}
          <div className="space-y-4">
            <h2 className="font-medium">מסמכים נדרשים</h2>
            <div className="space-y-4">
              <div className="border p-4 rounded-md">
                <label className="block text-sm font-medium mb-2">העלאת מסמכים רפואיים</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFormData({ ...formData, medicalDocuments: e.target.files[0] })}
                  className="hidden"
                  id="medical-docs"
                  multiple
                />
                <label
                  htmlFor="medical-docs"
                  className="flex items-center justify-center gap-2 p-2 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>בחר קבצים להעלאה</span>
                </label>
                {formData.medicalDocuments && (
                  <p className="mt-2 text-sm text-green-600">{formData.medicalDocuments.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* מידע נוסף */}
          <div className="space-y-2">
            <label className="text-sm font-medium">מידע נוסף</label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              className="w-full p-2 border rounded-md h-32 resize-none"
              placeholder="הוסף מידע נוסף שיכול להיות רלוונטי..."
            />
          </div>

          {/* כפתור שליחה */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                מגיש טופס...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                הגש טופס
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CitizenForm;