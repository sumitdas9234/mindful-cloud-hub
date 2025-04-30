
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {children}
    </div>
  );
};

export default AuthLayout;
