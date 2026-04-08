import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from './ui/card';
import { FileText, Award, Receipt, Bell } from 'lucide-react';

export const DashboardOverview = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'My Complaints', value: '0', icon: FileText, color: '#2D4238' },
    { label: 'Certificates', value: '0', icon: Award, color: '#C84B31' },
    { label: 'Pending Bills', value: '2', icon: Receipt, color: '#D97736' },
    { label: 'New Notices', value: '2', icon: Bell, color: '#3A654D' },
  ];

  return (
    <div className="space-y-8" data-testid="dashboard-overview">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-base text-[#4A4A4A]">
          Here's what's happening with your panchayat services
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="p-6 border border-[#DCD7CB] bg-white hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.color }}
                >
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A] mb-1">{stat.value}</p>
              <p className="text-sm text-[#4A4A4A]">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-8 border border-[#DCD7CB] bg-white">
          <h3 className="text-xl font-medium text-[#1A1A1A] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/dashboard/complaints"
              className="block p-4 border border-[#DCD7CB] rounded-lg hover:bg-[#F3F1EC] transition-colors duration-200"
            >
              <p className="font-medium text-[#1A1A1A]">Submit a Complaint</p>
              <p className="text-sm text-[#4A4A4A] mt-1">
                Report issues in your area
              </p>
            </a>
            <a
              href="/dashboard/certificates"
              className="block p-4 border border-[#DCD7CB] rounded-lg hover:bg-[#F3F1EC] transition-colors duration-200"
            >
              <p className="font-medium text-[#1A1A1A]">Apply for Certificate</p>
              <p className="text-sm text-[#4A4A4A] mt-1">
                Request official certificates
              </p>
            </a>
          </div>
        </Card>

        <Card className="p-8 border border-[#DCD7CB] bg-white">
          <h3 className="text-xl font-medium text-[#1A1A1A] mb-4">Important Information</h3>
          <div className="space-y-4">
            <div className="p-4 bg-[#C84B31]/10 border border-[#C84B31]/30 rounded-lg">
              <p className="text-sm font-medium text-[#1A1A1A]">
                Water Supply Maintenance
              </p>
              <p className="text-xs text-[#4A4A4A] mt-1">
                Scheduled for 20th January, 10 AM - 4 PM
              </p>
            </div>
            <div className="p-4 bg-[#3A654D]/10 border border-[#3A654D]/30 rounded-lg">
              <p className="text-sm font-medium text-[#1A1A1A]">
                Vaccination Drive
              </p>
              <p className="text-xs text-[#4A4A4A] mt-1">
                Free vaccination on 25th January at Health Center
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
