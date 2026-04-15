import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Award, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminCertificatesReport = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/certificates`, { withCredentials: true });
      setCertificates(data);
      setStats({
        total: data.length,
        pending: data.filter(c => c.status === 'Pending').length,
        approved: data.filter(c => c.status === 'Approved').length,
        rejected: data.filter(c => c.status === 'Rejected').length
      });
    } catch (error) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Pending', value: stats.pending },
    { name: 'Approved', value: stats.approved },
    { name: 'Rejected', value: stats.rejected }
  ];

  const handlePrint = () => window.print();

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <h1 className="text-4xl font-bold text-[#1A1A1A]">Certificates Report</h1>
        <Button onClick={handlePrint} className="bg-[#2D4238] hover:bg-[#1E2D26]">
          <Printer size={20} className="mr-2" />Print Report
        </Button>
      </div>

      <div className="print-title hidden">
        <h1 className="text-3xl font-bold text-center mb-2">Certificates Report</h1>
        <p className="text-center text-gray-600 mb-6">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Total Applications', value: stats.total, color: '#2D4238' },
          { label: 'Pending', value: stats.pending, color: '#D97736' },
          { label: 'Approved', value: stats.approved, color: '#3A654D' },
          { label: 'Rejected', value: stats.rejected, color: '#B23A3A' }
        ].map((stat, i) => (
          <Card key={i} className="p-6 border border-[#DCD7CB] bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color }}>
                <Award className="text-white" size={24} />
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
        <h3 className="text-xl font-medium mb-6">Certificates by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DCD7CB" />
            <XAxis dataKey="name" stroke="#4A4A4A" />
            <YAxis stroke="#4A4A4A" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#2D4238" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-medium mb-4">Recent Applications</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Applicant</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {certificates.slice(0, 10).map((cert) => (
                <tr key={cert.id} className="border-b">
                  <td className="py-3 px-4">{cert.certificate_type}</td>
                  <td className="py-3 px-4">{cert.applicant_name || cert.user_name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs text-white ${
                      cert.status === 'Pending' ? 'bg-[#D97736]' : 
                      cert.status === 'Approved' ? 'bg-[#3A654D]' : 'bg-[#B23A3A]'
                    }`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(cert.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};