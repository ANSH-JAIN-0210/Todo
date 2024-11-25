import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const authData = JSON.parse(localStorage.getItem('authData'));

  if (!authData || new Date().getTime() > authData.expiry) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
