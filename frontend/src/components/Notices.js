import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/notices`, {
        withCredentials: true,
      });
      setNotices(data);
    } catch (error) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-[#B23A3A] text-white';
      case 'Medium':
        return 'bg-[#D97736] text-white';
      case 'Low':
        return 'bg-[#3A654D] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6" data-testid="notices-section">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
          Notices
        </h1>
        <p className="text-base text-[#4A4A4A] mt-2">
          Important announcements and updates
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div>
        </div>
      ) : notices.length === 0 ? (
        <Card className="p-12 text-center border border-[#DCD7CB] bg-white">
          <p className="text-[#4A4A4A]">No notices available</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notices.map((notice, index) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 border border-[#DCD7CB] bg-white hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#C84B31] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium text-[#1A1A1A]">
                        {notice.title}
                      </h3>
                      <Badge className={getPriorityBadgeColor(notice.priority)}>
                        {notice.priority}
                      </Badge>
                    </div>
                    <p className="text-[#4A4A4A] mb-3">{notice.content}</p>
                    <p className="text-sm text-[#4A4A4A]">
                      Posted: {new Date(notice.created_at).toLocaleDateString()}
                    </p>
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
