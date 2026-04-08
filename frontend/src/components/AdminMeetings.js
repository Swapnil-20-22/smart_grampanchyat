import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit, CalendarIcon, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminMeetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    agenda: '',
    date: '',
    location: '',
    status: 'Upcoming',
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchMeetings();
    }
  }, [user]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editMode && currentMeeting) {
        await axios.patch(
          `${BACKEND_URL}/api/admin/meetings/${currentMeeting.id}`,
          formData,
          { withCredentials: true }
        );
        toast.success('Meeting updated successfully!');
      } else {
        await axios.post(
          `${BACKEND_URL}/api/admin/meetings`,
          formData,
          { withCredentials: true }
        );
        toast.success('Meeting created successfully!');
      }
      resetForm();
      setDialogOpen(false);
      fetchMeetings();
    } catch (error) {
      toast.error('Failed to save meeting');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMeeting = async (meetingId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/meetings/${meetingId}`, {
        withCredentials: true,
      });
      toast.success('Meeting deleted successfully!');
      fetchMeetings();
    } catch (error) {
      toast.error('Failed to delete meeting');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      agenda: '',
      date: '',
      location: '',
      status: 'Upcoming',
    });
    setEditMode(false);
    setCurrentMeeting(null);
  };

  const openEditDialog = (meeting) => {
    setCurrentMeeting(meeting);
    setFormData({
      title: meeting.title,
      agenda: meeting.agenda,
      date: meeting.date,
      location: meeting.location,
      status: meeting.status,
    });
    setEditMode(true);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <p className="text-[#B23A3A]">Access Denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-meetings">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Manage Meetings
          </h1>
          <p className="text-base text-[#4A4A4A] mt-2">
            Create and manage panchayat meetings
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="bg-[#2D4238] hover:bg-[#1E2D26] text-white transition-colors duration-200"
              data-testid="create-meeting-button"
            >
              <Plus size={20} className="mr-2" />
              Create Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#1A1A1A]">
                {editMode ? 'Edit Meeting' : 'Create New Meeting'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="meeting-form">
              <div className="space-y-2">
                <Label htmlFor="meeting-title">Title</Label>
                <Input
                  id="meeting-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="border-[#DCD7CB]"
                  data-testid="meeting-title-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-agenda">Agenda</Label>
                <Textarea
                  id="meeting-agenda"
                  value={formData.agenda}
                  onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                  required
                  rows={3}
                  className="border-[#DCD7CB]"
                  data-testid="meeting-agenda-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meeting-date">Date & Time</Label>
                  <Input
                    id="meeting-date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="border-[#DCD7CB]"
                    data-testid="meeting-date-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="border-[#DCD7CB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-location">Location</Label>
                <Input
                  id="meeting-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="border-[#DCD7CB]"
                  data-testid="meeting-location-input"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#2D4238] hover:bg-[#1E2D26]"
                data-testid="meeting-submit-btn"
              >
                {submitting ? 'Saving...' : editMode ? 'Update Meeting' : 'Create Meeting'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div>
        </div>
      ) : meetings.length === 0 ? (
        <Card className="p-12 text-center border border-[#DCD7CB] bg-white">
          <p className="text-[#4A4A4A]">No meetings found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 border border-[#DCD7CB] bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#2D4238] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CalendarIcon className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
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
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(meeting)}
                          className="text-[#2D4238] hover:bg-[#2D4238]/10"
                        >
                          <Edit size={18} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-[#B23A3A] hover:bg-[#B23A3A]/10"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Meeting?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this meeting? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMeeting(meeting.id)}
                                className="bg-[#B23A3A] hover:bg-[#952E2E]"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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
