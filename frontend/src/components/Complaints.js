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
import { Plus, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/complaints`, {
        withCredentials: true,
      });
      setComplaints(data);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        `${BACKEND_URL}/api/complaints`,
        { title, description },
        { withCredentials: true }
      );
      toast.success('Complaint submitted successfully!');
      setTitle('');
      setDescription('');
      setDialogOpen(false);
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const updateComplaintStatus = async (complaintId, status) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/api/complaints/${complaintId}/status`,
        { status },
        { withCredentials: true }
      );
      toast.success('Status updated successfully!');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#D97736] text-white';
      case 'In Progress':
        return 'bg-blue-600 text-white';
      case 'Resolved':
        return 'bg-[#3A654D] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredComplaints = complaints.filter(
    (c) => statusFilter === 'All' || c.status === statusFilter
  );

  return (
    <div className="space-y-6" data-testid="complaints-section">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Complaints
          </h1>
          <p className="text-base text-[#4A4A4A] mt-2">
            Submit and track your complaints
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#2D4238] hover:bg-[#1E2D26] text-white transition-colors duration-200"
              data-testid="new-complaint-button"
            >
              <Plus size={20} className="mr-2" />
              New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#1A1A1A]">Submit New Complaint</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="complaint-form">
              <div className="space-y-2">
                <Label htmlFor="complaint-title">Title</Label>
                <Input
                  id="complaint-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border-[#DCD7CB]"
                  data-testid="complaint-title-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complaint-description">Description</Label>
                <Textarea
                  id="complaint-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="border-[#DCD7CB]"
                  data-testid="complaint-description-input"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#2D4238] hover:bg-[#1E2D26]"
                data-testid="complaint-submit-btn"
              >
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <Filter size={20} className="text-[#4A4A4A]" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 border-[#DCD7CB]" data-testid="status-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <Card className="p-12 text-center border border-[#DCD7CB] bg-white">
          <p className="text-[#4A4A4A]">No complaints found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint, index) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 border border-[#DCD7CB] bg-white hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-[#1A1A1A]">
                        {complaint.title}
                      </h3>
                      <Badge className={getStatusBadgeColor(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </div>
                    <p className="text-[#4A4A4A] mb-3">{complaint.description}</p>
                    <div className="flex items-center gap-4 text-sm text-[#4A4A4A]">
                      <span>By: {complaint.user_name}</span>
                      <span>•</span>
                      <span>
                        {new Date(complaint.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {user?.role === 'admin' && (
                    <div className="ml-4">
                      <Select
                        value={complaint.status}
                        onValueChange={(status) =>
                          updateComplaintStatus(complaint.id, status)
                        }
                      >
                        <SelectTrigger className="w-40 border-[#DCD7CB]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
