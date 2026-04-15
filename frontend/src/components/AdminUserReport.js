import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Users, Printer } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminUserReport = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, admins: 0, regularUsers: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(data);
      setStats({
        total: data.length,
        admins: data.filter(u => u.role === 'admin').length,
        regularUsers: data.filter(u => u.role === 'user').length
      });
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <h1 className="text-4xl font-bold text-[#1A1A1A]">Users Report</h1>
        <Button onClick={handlePrint} className="bg-[#2D4238] hover:bg-[#1E2D26]">
          <Printer size={20} className="mr-2" />Print Report
        </Button>
      </div>

      <div className="print-title hidden">
        <h1 className="text-3xl font-bold text-center mb-2">Users Report</h1>
        <p className="text-center text-gray-600 mb-6">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 border border-[#DCD7CB] bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2D4238] rounded-lg flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.total}</p>
              <p className="text-sm text-[#4A4A4A]">Total Users</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border border-[#DCD7CB] bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#C84B31] rounded-lg flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.admins}</p>
              <p className="text-sm text-[#4A4A4A]">Administrators</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border border-[#DCD7CB] bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3A654D] rounded-lg flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.regularUsers}</p>
              <p className="text-sm text-[#4A4A4A]">Regular Users</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-medium mb-4">User List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-[#C84B31] text-white' : 'bg-[#2D4238] text-white'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};