import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, User } from 'lucide-react';
import { loginClerk } from '../../services/auth';
import styles from './styles.module.css';

const ClerkLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginClerk(credentials.email, credentials.password);
      onLogin();
    } catch (error) {
      setError('שגיאה בהתחברות. אנא בדוק את פרטי ההתחברות');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <h1 className="text-2xl font-bold text-center">כניסת פקיד מורשה</h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          <div className="space-y-2">
            <label className="text-sm font-medium">דואר אלקטרוני</label>
            <input
              type="email"
              value={credentials.email}
              onChange={e => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">סיסמה</label>
            <input
              type="password"
              value={credentials.password}
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'מתחבר...' : 'התחבר'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClerkLogin;