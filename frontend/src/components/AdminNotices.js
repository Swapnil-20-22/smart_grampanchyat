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
import { Plus, Trash2, Bell } from 'lucide-react';
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

export const AdminNotices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'Medium',
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchNotices();
    }
  }, [user]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        `${BACKEND_URL}/api/admin/notices`,
        formData,
        { withCredentials: true }
      );
      toast.success('Notice posted successfully!');
      setFormData({ title: '', content: '', priority: 'Medium' });
      setDialogOpen(false);
      fetchNotices();
    } catch (error) {
      toast.error('Failed to post notice');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteNotice = async (noticeId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/notices/${noticeId}`, {
        withCredentials: true,
      });
      toast.success('Notice deleted successfully!');
      fetchNotices();
    } catch (error) {
      toast.error('Failed to delete notice');
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

  if (user?.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <p className="text-[#B23A3A]">Access Denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-notices">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Manage Notices
          </h1>
          <p className="text-base text-[#4A4A4A] mt-2">
            Post and manage announcements
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#2D4238] hover:bg-[#1E2D26] text-white transition-colors duration-200"
              data-testid="create-notice-button"
            >
              <Plus size={20} className="mr-2" />
              Post Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#1A1A1A]">Post New Notice</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="notice-form">
              <div className="space-y-2">
                <Label htmlFor="notice-title">Title</Label>
                <Input
                  id="notice-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="border-[#DCD7CB]"
                  data-testid="notice-title-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notice-content">Content</Label>
                <Textarea
                  id="notice-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={4}
                  className="border-[#DCD7CB]"
                  data-testid="notice-content-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notice-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="border-[#DCD7CB]" data-testid="notice-priority-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#2D4238] hover:bg-[#1E2D26]"
                data-testid="notice-submit-btn"
              >
                {submitting ? 'Posting...' : 'Post Notice'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
              <Card className="p-6 border border-[#DCD7CB] bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#C84B31] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[#B23A3A] hover:bg-[#B23A3A]/10 ml-4"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Notice?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this notice? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteNotice(notice.id)}
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
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
