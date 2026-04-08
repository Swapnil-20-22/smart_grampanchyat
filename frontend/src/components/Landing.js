import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Users, FileText, Bell, Award } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#DCD7CB]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#2D4238] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">GP</span>
            </div>
            <span className="font-bold text-xl text-[#1A1A1A]">Gram Panchayat</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-[#1A1A1A]" data-testid="nav-login-button">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-[#2D4238] hover:bg-[#1E2D26] text-white" data-testid="nav-register-button">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section
        className="relative py-24 px-6 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://static.prod-images.emergentagent.com/jobs/569c15bc-4853-46ef-9990-7587e9086d0c/images/e3f94f6b5ec65b82c8dcbca51e3893423ba0577785c2a85ace15252c1c676499.png)',
        }}
      >
        <div className="absolute inset-0 bg-[#2D4238]/80"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Smart Gram Panchayat
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            Empowering village governance through digital transformation. Manage complaints,
            certificates, and community services all in one place.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-[#C84B31] hover:bg-[#A63D27] text-white px-8 py-6 text-lg transition-transform hover:-translate-y-1 duration-200"
              data-testid="hero-get-started-button"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1A1A1A] mb-4">
              Key Features
            </h2>
            <p className="text-base text-[#4A4A4A] max-w-2xl mx-auto">
              Everything you need for efficient village administration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl border border-[#DCD7CB] hover:-translate-y-1 transition-transform duration-200">
              <div className="w-12 h-12 bg-[#2D4238] rounded-lg flex items-center justify-center mb-4">
                <FileText className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-medium text-[#1A1A1A] mb-3">Complaint Management</h3>
              <p className="text-[#4A4A4A] leading-relaxed">
                Submit and track complaints with real-time status updates
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-[#DCD7CB] hover:-translate-y-1 transition-transform duration-200">
              <div className="w-12 h-12 bg-[#2D4238] rounded-lg flex items-center justify-center mb-4">
                <Award className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-medium text-[#1A1A1A] mb-3">Certificate Applications</h3>
              <p className="text-[#4A4A4A] leading-relaxed">
                Apply for certificates online and track application status
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-[#DCD7CB] hover:-translate-y-1 transition-transform duration-200">
              <div className="w-12 h-12 bg-[#2D4238] rounded-lg flex items-center justify-center mb-4">
                <Bell className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-medium text-[#1A1A1A] mb-3">Notices & Meetings</h3>
              <p className="text-[#4A4A4A] leading-relaxed">
                Stay updated with important announcements and meeting schedules
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-[#DCD7CB] hover:-translate-y-1 transition-transform duration-200">
              <div className="w-12 h-12 bg-[#2D4238] rounded-lg flex items-center justify-center mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-medium text-[#1A1A1A] mb-3">Member Directory</h3>
              <p className="text-[#4A4A4A] leading-relaxed">
                Access contact information of panchayat members and officials
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white border-t border-[#DCD7CB]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1A1A1A] mb-6">
            Ready to modernize your village administration?
          </h2>
          <p className="text-base text-[#4A4A4A] mb-8 leading-relaxed">
            Join hundreds of gram panchayats making governance accessible and transparent
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-[#2D4238] hover:bg-[#1E2D26] text-white px-8 py-6 text-lg transition-transform hover:-translate-y-1 duration-200"
              data-testid="cta-register-button"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 bg-[#F3F1EC] border-t border-[#DCD7CB]">
        <div className="max-w-7xl mx-auto text-center text-[#4A4A4A]">
          <p>&copy; 2026 Smart Gram Panchayat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
