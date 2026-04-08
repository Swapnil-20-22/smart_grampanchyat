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
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    certificate_type: '',
    details: '',
    applicant_name: '',
    father_name: '',
    address: '',
    phone: '',
    aadhar_number: '',
    purpose: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/certificates`, {
        withCredentials: true,
      });
      setCertificates(data);
    } catch (error) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        `${BACKEND_URL}/api/certificates`,
        formData,
        { withCredentials: true }
      );
      toast.success('Application submitted successfully!');
      setFormData({
        certificate_type: '',
        details: '',
        applicant_name: '',
        father_name: '',
        address: '',
        phone: '',
        aadhar_number: '',
        purpose: ''
      });
      setDialogOpen(false);
      fetchCertificates();
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const updateCertificateStatus = async (certificateId, status) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/api/certificates/${certificateId}/status`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Application ${status.toLowerCase()} successfully!`);
      fetchCertificates();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#D97736] text-white';
      case 'Approved':
        return 'bg-[#3A654D] text-white';
      case 'Rejected':
        return 'bg-[#B23A3A] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6" data-testid="certificates-section">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Certificates
          </h1>
          <p className="text-base text-[#4A4A4A] mt-2">
            Apply for and track certificate applications
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#2D4238] hover:bg-[#1E2D26] text-white transition-colors duration-200"
              data-testid="new-certificate-button"
            >
              <Plus size={20} className="mr-2" />
              Apply for Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#1A1A1A]">Apply for Certificate</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="certificate-form">
              <div className="space-y-2">
                <Label htmlFor="certificate-type">Certificate Type *</Label>
                <Select 
                  value={formData.certificate_type} 
                  onValueChange={(value) => setFormData({...formData, certificate_type: value})} 
                  required
                >
                  <SelectTrigger className="border-[#DCD7CB]" data-testid="certificate-type-select">
                    <SelectValue placeholder="Select certificate type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Income Certificate">Income Certificate</SelectItem>
                    <SelectItem value="Residence Certificate">Residence Certificate</SelectItem>
                    <SelectItem value="Caste Certificate">Caste Certificate</SelectItem>
                    <SelectItem value="Birth Certificate">Birth Certificate</SelectItem>
                    <SelectItem value="Death Certificate">Death Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicant-name">Applicant Name *</Label>
                  <Input
                    id="applicant-name"
                    value={formData.applicant_name}
                    onChange={(e) => setFormData({...formData, applicant_name: e.target.value})}
                    required
                    className="border-[#DCD7CB]"
                    placeholder="Full Name"
                    data-testid="applicant-name-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="father-name">Father's Name *</Label>
                  <Input
                    id="father-name"
                    value={formData.father_name}
                    onChange={(e) => setFormData({...formData, father_name: e.target.value})}
                    required
                    className="border-[#DCD7CB]"
                    placeholder="Father's Full Name"
                    data-testid="father-name-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-address">Address *</Label>
                <Textarea
                  id="cert-address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  rows={2}
                  className="border-[#DCD7CB]"
                  placeholder="Complete residential address"
                  data-testid="cert-address-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cert-phone">Phone Number *</Label>
                  <Input
                    id="cert-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    className="border-[#DCD7CB]"
                    placeholder="+91 98765 43210"
                    data-testid="cert-phone-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadhar-number">Aadhar Number *</Label>
                  <Input
                    id="aadhar-number"
                    value={formData.aadhar_number}
                    onChange={(e) => setFormData({...formData, aadhar_number: e.target.value})}
                    required
                    className="border-[#DCD7CB]"
                    placeholder="XXXX XXXX XXXX"
                    maxLength={12}
                    data-testid="aadhar-number-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose *</Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  required
                  className="border-[#DCD7CB]"
                  placeholder="Purpose of certificate (e.g., School admission, Bank loan)"
                  data-testid="purpose-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate-details">Additional Details</Label>
                <Textarea
                  id="certificate-details"
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                  required
                  rows={3}
                  className="border-[#DCD7CB]"
                  placeholder="Provide any additional information required for this certificate"
                  data-testid="certificate-details-input"
                />
              </div>
              
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#2D4238] hover:bg-[#1E2D26]"
                data-testid="certificate-apply-btn"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div>
        </div>
      ) : certificates.length === 0 ? (
        <Card className="p-12 text-center border border-[#DCD7CB] bg-white">
          <p className="text-[#4A4A4A]">No certificate applications found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 border border-[#DCD7CB] bg-white hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-[#1A1A1A]">
                        {cert.certificate_type}
                      </h3>
                      <Badge className={getStatusBadgeColor(cert.status)}>
                        {cert.status}
                      </Badge>
                    </div>
                    <p className="text-[#4A4A4A] mb-3">{cert.details}</p>
                    <div className="flex items-center gap-4 text-sm text-[#4A4A4A]">
                      <span>By: {cert.user_name}</span>
                      <span>•</span>
                      <span>
                        Applied: {new Date(cert.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {user?.role === 'admin' && cert.status === 'Pending' && (
                    <div className="ml-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateCertificateStatus(cert.id, 'Approved')}
                        className="bg-[#3A654D] hover:bg-[#2D4E3A] text-white"
                        data-testid="admin-approve-cert-btn"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateCertificateStatus(cert.id, 'Rejected')}
                        className="bg-[#B23A3A] hover:bg-[#952E2E] text-white"
                        data-testid="admin-reject-cert-btn"
                      >
                        <XCircle size={16} className="mr-1" />
                        Reject
                      </Button>
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
