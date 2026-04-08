import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './components/Landing';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardOverview } from './components/DashboardOverview';
import { Complaints } from './components/Complaints';
import { Certificates } from './components/Certificates';
import { Bills } from './components/Bills';
import { Meetings } from './components/Meetings';
import { Members } from './components/Members';
import { Notices } from './components/Notices';
import { AdminReports } from './components/AdminReports';
import { AdminUsers } from './components/AdminUsers';
import { AdminMeetings } from './components/AdminMeetings';
import { AdminNotices } from './components/AdminNotices';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="bills" element={<Bills />} />
            <Route path="meetings" element={<Meetings />} />
            <Route path="members" element={<Members />} />
            <Route path="notices" element={<Notices />} />
            <Route path="admin/reports" element={<AdminReports />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/meetings" element={<AdminMeetings />} />
            <Route path="admin/notices" element={<AdminNotices />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
