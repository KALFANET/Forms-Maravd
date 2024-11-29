import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, isClerk } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/assets/images/gov-logo.png" 
              alt="לוגו משרד התחבורה"
              className="h-10"
            />
            <div className="mr-4">
              <h1 className="text-lg font-bold">מערכת הפניות למכון הרפואי</h1>
              <p className="text-sm text-gray-500">משרד התחבורה והבטיחות בדרכים</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {isClerk ? 'פקיד מורשה' : 'אזרח'}
              </span>
              {isClerk && (
                <button
                  onClick={() => logoutClerk()}
                  className="text-sm text-red-600 hover:text-red-800"
                >
‎                  התנתק
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;