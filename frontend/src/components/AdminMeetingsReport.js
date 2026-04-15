import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Calendar, Printer, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminMeetingsReport = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/meetings`, { withCredentials: true });
      setMeetings(data);
      setStats({
        total: data.length,
        upcoming: data.filter(m => m.status === 'Upcoming').length,
        completed: data.filter(m => m.status === 'Completed').length
      });
    } catch (error) {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Upcoming', value: stats.upcoming },
    { name: 'Completed', value: stats.completed }
  ];

  const handlePrint = () => window.print();

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <h1 className="text-4xl font-bold text-[#1A1A1A]">Meetings Report</h1>
        <Button onClick={handlePrint} className="bg-[#2D4238] hover:bg-[#1E2D26]">
          <Printer size={20} className="mr-2" />Print Report
        </Button>
      </div>

      <div className="print-title hidden">
        <h1 className="text-3xl font-bold text-center mb-2">Meetings Report</h1>
        <p className="text-center text-gray-600 mb-6">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Total Meetings', value: stats.total, color: '#2D4238' },
          { label: 'Upcoming', value: stats.upcoming, color: '#3A654D' },
          { label: 'Completed', value: stats.completed, color: '#D97736' }
        ].map((stat, i) => (
          <Card key={i} className="p-6 border border-[#DCD7CB] bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color }}>
                <Calendar className="text-white" size={24} />
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
        <h3 className="text-xl font-medium mb-6">Meetings by Status</h3>
        <ResponsiveContainer width="100%" height={250}>
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
        <h3 className="text-xl font-medium mb-4">All Meetings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Location</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Agenda</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => (
                <tr key={meeting.id} className="border-b">
                  <td className="py-3 px-4 font-medium">{meeting.title}</td>
                  <td className="py-3 px-4">{new Date(meeting.date).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1"><MapPin size={14} />{meeting.location}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={meeting.status === 'Upcoming' ? 'bg-[#3A654D] text-white' : 'bg-gray-500 text-white'}>
                      {meeting.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-[#4A4A4A]">{meeting.agenda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
