import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Timer } from 'lucide-react';
import { verifyOTP } from '../../services/sms';

const OTPVerification = ({ phoneNumber, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsVerifying(true);
    setError('');

    try {
      const result = await verifyOTP(otp);
      if (result) {
        onVerified(true);
      } else {
        setError('קוד שגוי. אנא נסה שנית.');
      }
    } catch (error) {
      setError('אירעה שגיאה באימות. אנא נסה שנית.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-xl font-bold text-center">אימות מספר טלפון</h2>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <Alert>
            <Lock className="w-4 h-4" />
            <AlertDescription>
              הזן את קוד האימות שנשלח למספר {phoneNumber}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) setOtp(value);
              }}
              placeholder="הזן קוד בן 6 ספרות"
              className="w-full text-center text-2xl tracking-wider p-2 border rounded-md"
              maxLength={6}
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <Timer className="w-4 h-4 inline-block ml-1" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>

            <Button
              type="submit"
              disabled={otp.length !== 6 || isVerifying || timeLeft === 0}
            >
              {isVerifying ? 'מאמת...' : 'אמת קוד'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OTPVerification;