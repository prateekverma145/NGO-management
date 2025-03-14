import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface DonationFormData {
  amount: number;
  cause: string;
  message: string;
  paymentMethod: 'card' | 'upi' | 'netbanking';
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  donationDetails: {
    amount: number;
    cause: string;
  } | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, donationDetails }) => {
  if (!isOpen || !donationDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Donation!</h3>
          <p className="text-lg text-gray-600 mb-4">
            Your generous donation of ₹{donationDetails.amount} towards {donationDetails.cause} has been successfully processed.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Together, we can make a real difference in the lives of those who need it most.
          </p>
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              A confirmation email with your donation receipt will be sent to your registered email address.
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Donate: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [cause, setCause] = useState('education');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successfulDonation, setSuccessfulDonation] = useState<{ amount: number; cause: string } | null>(null);

  const predefinedAmounts = [100, 500, 1000, 5000];

  const causes = [
    { id: 'education', label: 'Education for Children', icon: '📚' },
    { id: 'healthcare', label: 'Healthcare Support', icon: '🏥' },
    { id: 'environment', label: 'Environmental Protection', icon: '🌱' },
    { id: 'elderly', label: 'Elderly Care', icon: '👴' },
    { id: 'disaster', label: 'Disaster Relief', icon: '🆘' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please sign in to make a donation');
        setLoading(false);
        return;
      }

      const finalAmount = selectedAmount || Number(customAmount);
      if (!finalAmount || finalAmount <= 0) {
        toast.error('Please enter a valid amount');
        setLoading(false);
        return;
      }

      const donationData: DonationFormData = {
        amount: finalAmount,
        cause,
        message,
        paymentMethod,
      };

      const response = await fetch('http://localhost:5000/api/donations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Make sure token is properly formatted
        },
        body: JSON.stringify(donationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process donation');
      }

      // Success handling
      setSuccessfulDonation({
        amount: finalAmount,
        cause: causes.find(c => c.id === cause)?.label || cause
      });
      setShowSuccessModal(true);

      // Reset form
      setSelectedAmount('');
      setCustomAmount('');
      setMessage('');
      toast.success('Donation processed successfully!');
    } catch (error) {
      console.error('Donation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process donation');

      // If it's an authentication error, redirect to login
      if (error instanceof Error && error.message.toLowerCase().includes('authentication')) {
        // Redirect to login page or show login modal
        toast.error('Please sign in again to continue');
        // You might want to redirect to login page here
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Difference Today</h1>
          <p className="text-lg text-gray-600">Your contribution can change lives and create lasting impact</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Amount Selection */}
              <div>
                <label className="text-lg font-medium text-gray-700 mb-4 block">
                  Select Donation Amount
                </label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className={`py-3 px-4 rounded-lg border-2 transition-all ${selectedAmount === amount
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-200'
                        }`}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount('');
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Cause Selection */}
              <div>
                <label className="text-lg font-medium text-gray-700 mb-4 block">
                  Choose a Cause
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {causes.map((causeOption) => (
                    <button
                      key={causeOption.id}
                      type="button"
                      className={`p-4 rounded-lg border-2 transition-all text-left ${cause === causeOption.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                        }`}
                      onClick={() => setCause(causeOption.id)}
                    >
                      <span className="text-2xl mb-2 block">{causeOption.icon}</span>
                      <span className="font-medium">{causeOption.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-lg font-medium text-gray-700 mb-4 block">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['card', 'upi', 'netbanking'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === method
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                        }`}
                      onClick={() => setPaymentMethod(method as 'card' | 'upi' | 'netbanking')}
                    >
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-lg font-medium text-gray-700 mb-4 block">
                  Leave a Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share why you're making this donation..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (!selectedAmount && !customAmount)}
                className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Donate Now'}
              </button>
            </form>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">100% Impact</h3>
            <p className="text-gray-600">Every rupee you donate goes directly to the cause you choose</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">Your transactions are protected with bank-grade security</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Regular Updates</h3>
            <p className="text-gray-600">Get notifications about how your donation is making an impact</p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        donationDetails={successfulDonation}
      />
    </div>
  );
};

export default Donate;