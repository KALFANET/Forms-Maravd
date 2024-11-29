import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} משרד התחבורה והבטיחות בדרכים</p>
          <p className="mt-1">כל הזכויות שמורות למדינת ישראל</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;