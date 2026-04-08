import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trash2, Shield } from 'lucide-react';
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

export const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/api/admin/users/${userId}/role`,
        { role },
        { withCredentials: true }
      );
      toast.success('User role updated successfully!');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/users/${userId}`, {
        withCredentials: true,
      });
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete user');
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
    <div className="space-y-6" data-testid="admin-users">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
          User Management
        </h1>
        <p className="text-base text-[#4A4A4A] mt-2">
          Manage users and their roles
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div>
        </div>
      ) : users.length === 0 ? (
        <Card className="p-12 text-center border border-[#DCD7CB] bg-white">
          <p className="text-[#4A4A4A]">No users found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((userItem, index) => (
            <motion.div
              key={userItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 border border-[#DCD7CB] bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-[#1A1A1A]">
                        {userItem.name}
                      </h3>
                      <Badge
                        className={
                          userItem.role === 'admin'
                            ? 'bg-[#C84B31] text-white'
                            : 'bg-[#2D4238] text-white'
                        }
                      >
                        {userItem.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                    </div>
                    <p className="text-[#4A4A4A] text-sm">{userItem.email}</p>
                    <p className="text-[#4A4A4A] text-xs mt-1">
                      Joined: {new Date(userItem.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <Select
                      value={userItem.role}
                      onValueChange={(role) => updateUserRole(userItem.id, role)}
                      disabled={userItem.id === user._id}
                    >
                      <SelectTrigger className="w-32 border-[#DCD7CB]" data-testid="user-role-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={userItem.id === user._id}
                          className="text-[#B23A3A] hover:bg-[#B23A3A]/10"
                          data-testid="delete-user-button"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the user account for {userItem.name}.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteUser(userItem.id)}
                            className="bg-[#B23A3A] hover:bg-[#952E2E]"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
