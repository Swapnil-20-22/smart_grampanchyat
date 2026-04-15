import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminMembersManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', position: '', photo_url: '', contact: '' });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editMode && currentMember) {
        await axios.patch(`${BACKEND_URL}/api/admin/members/${currentMember.id}`, formData, { withCredentials: true });
        toast.success('Member updated successfully!');
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/members`, formData, { withCredentials: true });
        toast.success('Member added successfully!');
      }
      resetForm();
      setDialogOpen(false);
      fetchMembers();
    } catch (error) {
      toast.error('Failed to save member');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMember = async (memberId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/members/${memberId}`, { withCredentials: true });
      toast.success('Member deleted successfully!');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', position: '', photo_url: '', contact: '' });
    setEditMode(false);
    setCurrentMember(null);
  };

  const openEditDialog = (member) => {
    setCurrentMember(member);
    setFormData({ name: member.name, position: member.position, photo_url: member.photo_url, contact: member.contact });
    setEditMode(true);
    setDialogOpen(true);
  };

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-[#1A1A1A]">Manage Members</h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-[#2D4238] hover:bg-[#1E2D26]">
              <Plus size={20} className="mr-2" />Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Member' : 'Add New Member'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Photo URL</Label>
                <Input value={formData.photo_url} onChange={(e) => setFormData({...formData, photo_url: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Contact</Label>
                <Input value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} required />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-[#2D4238] hover:bg-[#1E2D26]">
                {submitting ? 'Saving...' : editMode ? 'Update Member' : 'Add Member'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <Card key={member.id} className="p-6 border border-[#DCD7CB] bg-white">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#2D4238]">
                <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2D4238&color=fff&size=200`; }} />
              </div>
              <h3 className="text-xl font-medium text-[#1A1A1A] mb-1">{member.name}</h3>
              <p className="text-sm font-medium text-[#C84B31] mb-4">{member.position}</p>
              <p className="text-sm text-[#4A4A4A] mb-4">{member.contact}</p>
              <div className="flex gap-2 justify-center">
                <Button size="sm" variant="ghost" onClick={() => openEditDialog(member)} className="text-[#2D4238]">
                  <Edit size={16} className="mr-1" />Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-[#B23A3A]">
                      <Trash2 size={16} className="mr-1" />Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Member?</AlertDialogTitle>
                      <AlertDialogDescription>Are you sure you want to delete {member.name}? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMember(member.id)} className="bg-[#B23A3A] hover:bg-[#952E2E]">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};