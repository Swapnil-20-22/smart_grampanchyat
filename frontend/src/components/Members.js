import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/members`, {
        withCredentials: true,
      });
      setMembers(data);
    } catch (error) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="members-section">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
          Panchayat Members
        </h1>
        <p className="text-base text-[#4A4A4A] mt-2">
          Contact information for panchayat officials
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div>
        </div>
      ) : members.length === 0 ? (
        <Card className="p-12 text-center border border-[#DCD7CB] bg-white">
          <p className="text-[#4A4A4A]">No members found</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 border border-[#DCD7CB] bg-white hover:-translate-y-1 transition-transform duration-200">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#2D4238]">
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2D4238&color=fff&size=200`;
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-medium text-[#1A1A1A] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-[#C84B31] mb-4">
                    {member.position}
                  </p>
                  <div className="space-y-2 text-sm text-[#4A4A4A]">
                    <div className="flex items-center justify-center gap-2">
                      <Phone size={16} />
                      <span>{member.contact}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
