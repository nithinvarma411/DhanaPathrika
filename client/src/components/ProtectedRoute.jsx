import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');
  // console.log("Token:", token);

  // console.log("Raw cookie:", document.cookie);
  // console.log("Token from js-cookie:", Cookies.get('token'));


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
