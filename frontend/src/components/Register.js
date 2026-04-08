import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(email, password, name);
    setLoading(false);

    if (result.success) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            'url(https://static.prod-images.emergentagent.com/jobs/569c15bc-4853-46ef-9990-7587e9086d0c/images/f3c0cb04c86610c4bb38260b344bbd7efd89135436a98246bef64487796e482f.png)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#2D4238]/90 to-[#C84B31]/80"></div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Smart Gram Panchayat</h1>
          <p className="text-lg opacity-90">
            Join us in digital governance for village administration
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FAFAFA]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Create Account</h2>
            <p className="text-[#4A4A4A]">Register to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#1A1A1A]">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-[#DCD7CB] focus:ring-[#2D4238]"
                data-testid="register-name-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1A1A1A]">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#DCD7CB] focus:ring-[#2D4238]"
                data-testid="register-email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1A1A1A]">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[#DCD7CB] focus:ring-[#2D4238]"
                data-testid="register-password-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D4238] hover:bg-[#1E2D26] text-white transition-colors duration-200"
              data-testid="register-submit-button"
            >
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>

          <p className="mt-6 text-center text-[#4A4A4A]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C84B31] hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
