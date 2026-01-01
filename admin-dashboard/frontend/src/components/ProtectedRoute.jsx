import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from './Layout';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.warn('[ProtectedRoute] No token found, redirecting to signin');
    return <Navigate to="/signin" replace />;
  }
  
  return <Layout>{children}</Layout>;
}