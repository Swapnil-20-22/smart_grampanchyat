import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/meetings`, {
        withCredentials: true,
      });
      setMeetings(data);
    } catch (error) {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const upcomingMeetings = meetings.filter((m) => m.status === 'Upcoming');
  const completedMeetings = meetings.filter((m) => m.status === 'Completed');

  const MeetingCard = ({ meeting, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-6 border border-[#DCD7CB] bg-white hover:-translate-y-1 transition-transform duration-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#2D4238] rounded-lg flex items-center justify-center flex-shrink-0">
            <CalendarIcon className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-medium text-[#1A1A1A]">
                {meeting.title}
              </h3>
              <Badge
                className={
                  meeting.status === 'Upcoming'
                    ? 'bg-[#3A654D] text-white'
                    : 'bg-gray-500 text-white'
                }
              >
                {meeting.status}
              </Badge>
            </div>
            <p className="text-[#4A4A4A] mb-3">{meeting.agenda}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#4A4A4A]">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} />
                <span>{new Date(meeting.date).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{meeting.location}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6" data-testid="meetings-section">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
          Meetings
        </h1>
        <p className="text-base text-[#4A4A4A] mt-2">
          View upcoming and past panchayat meetings
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div>
        </div>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-[#F3F1EC] border border-[#DCD7CB]">
            <TabsTrigger value="upcoming" data-testid="upcoming-meetings-tab">
              Upcoming ({upcomingMeetings.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="completed-meetings-tab">
              Completed ({completedMeetings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingMeetings.length === 0 ? (
              <Card className="p-12 text-center border border-[#DCD7CB] bg-white">
                <p className="text-[#4A4A4A]">No upcoming meetings</p>
              </Card>
            ) : (
              upcomingMeetings.map((meeting, index) => (
                <MeetingCard key={meeting.id} meeting={meeting} index={index} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedMeetings.length === 0 ? (
              <Card className="p-12 text-center border border-[#DCD7CB] bg-white">
                <p className="text-[#4A4A4A]">No completed meetings</p>
              </Card>
            ) : (
              completedMeetings.map((meeting, index) => (
                <MeetingCard key={meeting.id} meeting={meeting} index={index} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
