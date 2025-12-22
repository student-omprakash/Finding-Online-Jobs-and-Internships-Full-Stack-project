import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import EditProfile from './pages/EditProfile';
import CompleteProfile from './pages/CompleteProfile';
import Jobs from './pages/Jobs';
import { Blog, ResumeGuide, FAQ, RecruiterLanding } from './pages/StaticPages';

import Dashboard from './pages/Dashboard';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/resume-guide" element={<ResumeGuide />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/recruiting" element={<RecruiterLanding />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
