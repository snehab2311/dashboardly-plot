import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import EDAGenerator from './pages/EDAGenerator';
import KPIBuilder from './pages/KPIBuilder';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import MyDashboards from './pages/MyDashboards';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <Routes>
          {/* Auth routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Protected routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/eda" element={<EDAGenerator />} />
            <Route path="/kpi-builder" element={<KPIBuilder />} />
            <Route path="/my-dashboards" element={<MyDashboards />} />
          </Route>
        </Routes>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
