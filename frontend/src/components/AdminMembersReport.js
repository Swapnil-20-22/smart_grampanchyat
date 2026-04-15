import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Users, Printer, Phone } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminMembersReport = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/members`, { withCredentials: true });
      setMembers(data);
    } catch (error) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div></div>;

  const positionCounts = members.reduce((acc, m) => {
    acc[m.position] = (acc[m.position] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <h1 className="text-4xl font-bold text-[#1A1A1A]">Members Report</h1>
        <Button onClick={handlePrint} className="bg-[#2D4238] hover:bg-[#1E2D26]">
          <Printer size={20} className="mr-2" />Print Report
        </Button>
      </div>

      <div className="print-title hidden">
        <h1 className="text-3xl font-bold text-center mb-2">Panchayat Members Report</h1>
        <p className="text-center text-gray-600 mb-6">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 border border-[#DCD7CB] bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2D4238] rounded-lg flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{members.length}</p>
              <p className="text-sm text-[#4A4A4A]">Total Members</p>
            </div>
          </div>
        </Card>
        {Object.entries(positionCounts).slice(0, 2).map(([position, count], i) => (
          <Card key={i} className="p-6 border border-[#DCD7CB] bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: i === 0 ? '#C84B31' : '#3A654D' }}>
                <Users className="text-white" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#1A1A1A]">{count}</p>
                <p className="text-sm text-[#4A4A4A]">{position}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-medium mb-4">Members Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Photo</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Position</th>
                <th className="text-left py-3 px-4">Contact</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#2D4238]">
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2D4238&color=fff&size=100`; }} />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{member.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs bg-[#C84B31] text-white">{member.position}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1"><Phone size={14} />{member.contact}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
