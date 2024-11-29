import React from 'react';
import { AuthProvider } from './context/AuthContext';
import ClerkPortal from './components/clerk/ClerkPortal';
import CitizenForm from './components/citizen/CitizenForm';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { isClerk } = useAuth();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        {isClerk ? <ClerkPortal /> : <CitizenForm />}
      </div>
    </AuthProvider>
  );
};

export default App;
