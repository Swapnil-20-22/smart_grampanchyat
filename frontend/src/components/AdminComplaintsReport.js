import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { FileText, Printer } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const COLORS = ['#D97736', '#3A654D', '#2D4238'];

export const AdminComplaintsReport = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/complaints`, { withCredentials: true });
      setComplaints(data);
      setStats({
        total: data.length,
        pending: data.filter(c => c.status === 'Pending').length,
        inProgress: data.filter(c => c.status === 'In Progress').length,
        resolved: data.filter(c => c.status === 'Resolved').length
      });
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Pending', value: stats.pending, fill: '#D97736' },
    { name: 'In Progress', value: stats.inProgress, fill: '#3A654D' },
    { name: 'Resolved', value: stats.resolved, fill: '#2D4238' }
  ];

  const handlePrint = () => window.print();

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <h1 className="text-4xl font-bold text-[#1A1A1A]">Complaints Report</h1>
        <Button onClick={handlePrint} className="bg-[#2D4238] hover:bg-[#1E2D26]">
          <Printer size={20} className="mr-2" />Print Report
        </Button>
      </div>

      <div className="print-title hidden">
        <h1 className="text-3xl font-bold text-center mb-2">Complaints Report</h1>
        <p className="text-center text-gray-600 mb-6">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Total', value: stats.total, color: '#2D4238' },
          { label: 'Pending', value: stats.pending, color: '#D97736' },
          { label: 'In Progress', value: stats.inProgress, color: '#3A654D' },
          { label: 'Resolved', value: stats.resolved, color: '#2D4238' }
        ].map((stat, i) => (
          <Card key={i} className="p-6 border border-[#DCD7CB] bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color }}>
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#1A1A1A]">{stat.value}</p>
                <p className="text-sm text-[#4A4A4A]">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-medium mb-6">Complaints by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
              {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-medium mb-4">Recent Complaints</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Submitted By</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.slice(0, 10).map((complaint) => (
                <tr key={complaint.id} className="border-b">
                  <td className="py-3 px-4">{complaint.title}</td>
                  <td className="py-3 px-4">{complaint.category || 'Other'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs text-white ${
                      complaint.status === 'Pending' ? 'bg-[#D97736]' : 
                      complaint.status === 'In Progress' ? 'bg-[#3A654D]' : 'bg-[#2D4238]'
                    }`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{complaint.user_name}</td>
                  <td className="py-3 px-4">{new Date(complaint.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};