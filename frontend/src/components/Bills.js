import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Receipt } from 'lucide-react';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/bills`, {
        withCredentials: true,
      });
      setBills(data);
    } catch (error) {
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="bills-section">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
          Bills
        </h1>
        <p className="text-base text-[#4A4A4A] mt-2">
          View your pending and past bills
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4238] mx-auto"></div>
        </div>
      ) : bills.length === 0 ? (
        <Card className="p-12 text-center border border-[#DCD7CB] bg-white">
          <p className="text-[#4A4A4A]">No bills available</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {bills.map((bill, index) => (
            <motion.div
              key={bill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 border border-[#DCD7CB] bg-white hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#2D4238] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Receipt className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-[#1A1A1A] mb-1">
                        {bill.title}
                      </h3>
                      <p className="text-[#4A4A4A] text-sm mb-3">
                        {bill.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-[#4A4A4A]">
                        <span>
                          Due Date: {new Date(bill.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#1A1A1A]">
                      ₹{bill.amount.toFixed(2)}
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
