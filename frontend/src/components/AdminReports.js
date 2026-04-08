import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, FileText, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const COLORS = ['#C84B31', '#D97736', '#3A654D', '#2D4238'];

export const AdminReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/reports`, {
        withCredentials: true,
      });
      setReports(data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <p className="text-[#B23A3A]">Access Denied. Admin only.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div>
      </div>
    );
  }

  const statsCards = [
    { label: 'Total Users', value: reports?.total_users || 0, icon: Users, color: '#2D4238' },
    { label: 'Total Complaints', value: reports?.total_complaints || 0, icon: FileText, color: '#C84B31' },
    { label: 'Resolved Complaints', value: reports?.resolved_complaints || 0, icon: TrendingUp, color: '#3A654D' },
    { label: 'Certificates Issued', value: reports?.approved_certificates || 0, icon: Award, color: '#D97736' },
  ];

  const complaintsChartData = [
    { name: 'Pending', value: reports?.pending_complaints || 0, fill: '#D97736' },
    { name: 'In Progress', value: reports?.in_progress_complaints || 0, fill: '#3A654D' },
    { name: 'Resolved', value: reports?.resolved_complaints || 0, fill: '#2D4238' },
  ];

  const certificatesChartData = [
    { name: 'Pending', value: reports?.pending_certificates || 0 },
    { name: 'Approved', value: reports?.approved_certificates || 0 },
    { name: 'Rejected', value: reports?.rejected_certificates || 0 },
  ];

  return (
    <div className="space-y-6" data-testid="admin-reports">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
          Admin Reports
        </h1>
        <p className="text-base text-[#4A4A4A] mt-2">
          Overview of system statistics and analytics
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 border border-[#DCD7CB] bg-white hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: stat.color }}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-[#1A1A1A] mb-1">{stat.value}</p>
                <p className="text-sm text-[#4A4A4A]">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-[#DCD7CB] bg-white">
          <h3 className="text-xl font-medium text-[#1A1A1A] mb-6">Complaints by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complaintsChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {complaintsChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border border-[#DCD7CB] bg-white">
          <h3 className="text-xl font-medium text-[#1A1A1A] mb-6">Certificates by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={certificatesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCD7CB" />
              <XAxis dataKey="name" stroke="#4A4A4A" />
              <YAxis stroke="#4A4A4A" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#2D4238" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 border border-[#DCD7CB] bg-white">
        <h3 className="text-xl font-medium text-[#1A1A1A] mb-6">Detailed Statistics</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-[#2D4238] mb-3">Complaint Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-[#F3F1EC] rounded-lg">
                <span className="text-[#1A1A1A]">Pending</span>
                <span className="font-bold text-[#D97736]">{reports?.pending_complaints}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F3F1EC] rounded-lg">
                <span className="text-[#1A1A1A]">In Progress</span>
                <span className="font-bold text-[#3A654D]">{reports?.in_progress_complaints}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F3F1EC] rounded-lg">
                <span className="text-[#1A1A1A]">Resolved</span>
                <span className="font-bold text-[#2D4238]">{reports?.resolved_complaints}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-[#2D4238] mb-3">Certificate Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-[#F3F1EC] rounded-lg">
                <span className="text-[#1A1A1A]">Pending</span>
                <span className="font-bold text-[#D97736]">{reports?.pending_certificates}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F3F1EC] rounded-lg">
                <span className="text-[#1A1A1A]">Approved</span>
                <span className="font-bold text-[#3A654D]">{reports?.approved_certificates}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F3F1EC] rounded-lg">
                <span className="text-[#1A1A1A]">Rejected</span>
                <span className="font-bold text-[#B23A3A]">{reports?.rejected_certificates}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
