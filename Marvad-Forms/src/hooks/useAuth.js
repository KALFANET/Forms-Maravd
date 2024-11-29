import { useState, useEffect } from 'react';
import { auth } from '../firebase-config';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isClerk, setIsClerk] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // כאן בדיקה האם המשתמש הוא פקיד
        // במערכת אמיתית יש לבדוק מול מסד הנתונים
        setUser(user);
        setIsClerk(user.email?.endsWith('@mot.gov.il') || false);
      } else {
        setUser(null);
        setIsClerk(false);
      }
    });

    return unsubscribe;
  }, []);

  return { user, isClerk };
};