import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinnerDemo from './LoadingSpinner';

export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinnerDemo fullScreen />;
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
}