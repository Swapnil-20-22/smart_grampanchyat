import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  Home,
  FileText,
  Award,
  Receipt,
  Calendar,
  Users,
  Bell,
  LogOut,
  Menu,
  X,
  BarChart3,
  Settings,
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userNavItems = [
    { path: '/dashboard', label: 'Overview', icon: Home },
    { path: '/dashboard/complaints', label: 'Complaints', icon: FileText },
    { path: '/dashboard/certificates', label: 'Certificates', icon: Award },
    { path: '/dashboard/bills', label: 'Bills', icon: Receipt },
    { path: '/dashboard/meetings', label: 'Meetings', icon: Calendar },
    { path: '/dashboard/members', label: 'Members', icon: Users },
    { path: '/dashboard/notices', label: 'Notices', icon: Bell },
  ];

  const adminManageItems = [
    { path: '/dashboard/admin/users', label: 'Manage Users', icon: Users },
    { path: '/dashboard/admin/members', label: 'Manage Members', icon: Settings },
    { path: '/dashboard/admin/meetings', label: 'Manage Meetings', icon: Calendar },
    { path: '/dashboard/admin/notices', label: 'Manage Notices', icon: Bell },
  ];

  const adminReportItems = [
    { path: '/dashboard/admin/overview', label: 'Overview Report', icon: Home },
    { path: '/dashboard/admin/report/users', label: 'Users Report', icon: Users },
    { path: '/dashboard/admin/report/complaints', label: 'Complaints Report', icon: FileText },
    { path: '/dashboard/admin/report/certificates', label: 'Certificates Report', icon: Award },
    { path: '/dashboard/admin/report/meetings', label: 'Meetings Report', icon: Calendar },
    { path: '/dashboard/admin/report/members', label: 'Members Report', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#DCD7CB] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2D4238] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">GP</span>
          </div>
          <span className="font-bold text-lg text-[#1A1A1A]">Gram Panchayat</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#1A1A1A]"
          data-testid="mobile-menu-toggle"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#F3F1EC] border-r border-[#DCD7CB] z-40 transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        data-testid="dashboard-sidebar"
      >
        <div className="p-6 border-b border-[#DCD7CB] flex-shrink-0">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#2D4238] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">GP</span>
            </div>
            <span className="font-bold text-xl text-[#1A1A1A]">Gram Panchayat</span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#DCD7CB]">
            <p className="text-sm font-medium text-[#1A1A1A]">{user?.name}</p>
            <p className="text-xs text-[#4A4A4A] mt-1">{user?.email}</p>
            <div className="mt-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-[#2D4238] text-white rounded">
                {user?.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {userNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#2D4238] text-white'
                    : 'text-[#1A1A1A] hover:bg-[#E5E0D8]'
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <>
              <div className="pt-3 pb-1 px-4">
                <p className="text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">Admin Management</p>
              </div>
              {adminManageItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#C84B31] text-white'
                        : 'text-[#1A1A1A] hover:bg-[#E5E0D8]'
                    }`}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <Icon size={18} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-3 pb-1 px-4">
                <p className="text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">Reports</p>
              </div>
              {adminReportItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#C84B31] text-white'
                        : 'text-[#1A1A1A] hover:bg-[#E5E0D8]'
                    }`}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <Icon size={18} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-[#DCD7CB] flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-[#B23A3A] hover:bg-[#B23A3A]/10"
            data-testid="logout-button"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};
