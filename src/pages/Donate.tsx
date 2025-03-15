import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface NGO {
  _id: string;
  name: string;
  organizationName: string;
  description?: string;
}

interface DonationFormData {
  amount: number;
  cause: string;
  message: string;
  paymentMethod: 'card' | 'upi' | 'netbanking';
  recipientId: string;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  donationDetails: {
    amount: number;
    cause: string;
    ngoName: string;
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
          <p className="text-md text-gray-700 mb-4">
            Recipient: <span className="font-semibold">{donationDetails.ngoName}</span>
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
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [cause, setCause] = useState('education');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successfulDonation, setSuccessfulDonation] = useState<{ amount: number; cause: string; ngoName: string } | null>(null);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [selectedNGO, setSelectedNGO] = useState<string>('');
  const [loadingNGOs, setLoadingNGOs] = useState(false);

  const predefinedAmounts = [100, 500, 1000, 5000];

  const causes = [
    { id: 'education', label: 'Education for Children', icon: '📚' },
    { id: 'healthcare', label: 'Healthcare Support', icon: '🏥' },
    { id: 'environment', label: 'Environmental Protection', icon: '🌱' },
    { id: 'elderly', label: 'Elderly Care', icon: '👴' },
    { id: 'disaster', label: 'Disaster Relief', icon: '🆘' },
  ];

  // Fetch NGOs when component mounts
  useEffect(() => {
    const fetchNGOs = async () => {
      if (!token) return;
      
      setLoadingNGOs(true);
      try {
        const response = await fetch('http://localhost:5000/api/donations/ngos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch NGOs');
        }

        const data = await response.json();
        if (data.success && data.ngos) {
          // Filter out the current NGO if the user is an NGO
          const filteredNGOs = user?.userType === 'ngo' 
            ? data.ngos.filter((ngo: NGO) => ngo._id !== user._id)
            : data.ngos;
            
          setNgos(filteredNGOs);
          
          // Set the first NGO as default if available
          if (filteredNGOs.length > 0) {
            setSelectedNGO(filteredNGOs[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching NGOs:', error);
        toast.error('Failed to load NGOs. Please try again later.');
      } finally {
        setLoadingNGOs(false);
      }
    };

    fetchNGOs();
  }, [token, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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

      if (!selectedNGO) {
        toast.error('Please select an NGO to donate to');
        setLoading(false);
        return;
      }

      const donationData: DonationFormData = {
        amount: finalAmount,
        cause,
        message,
        paymentMethod,
        recipientId: selectedNGO
      };

      const response = await fetch('http://localhost:5000/api/donations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(donationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process donation');
      }

      // Get the NGO name for the success message
      const selectedNGOData = ngos.find(ngo => ngo._id === selectedNGO);
      const ngoName = selectedNGOData ? (selectedNGOData.organizationName || selectedNGOData.name) : 'Unknown NGO';

      // Success handling
      setSuccessfulDonation({
        amount: finalAmount,
        cause: causes.find(c => c.id === cause)?.label || cause,
        ngoName
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

      if (error instanceof Error && error.message.toLowerCase().includes('authentication')) {
        toast.error('Please sign in again to continue');
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
              {/* NGO Selection using Dropdown */}
              <div>
                <label className="text-lg font-medium text-gray-700 mb-4 block">
                  Select NGO to Donate To
                </label>
                {loadingNGOs ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : ngos.length === 0 ? (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No NGOs available for donation at the moment.</p>
                  </div>
                ) : (
                  <select
                    value={selectedNGO}
                    onChange={(e) => setSelectedNGO(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select an NGO</option>
                    {ngos.map((ngo) => (
                      <option key={ngo._id} value={ngo._id}>
                        {ngo.organizationName || ngo.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

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
                      className={`py-3 px-4 rounded-lg border-2 transition-all ${
                        selectedAmount === amount
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
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        cause === causeOption.id
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
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === method
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
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !selectedNGO}
                  className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg transition-colors ${
                    loading || !selectedNGO
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Donate Now'
                  )}
                </button>
              </div>
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

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        donationDetails={successfulDonation}
      />
    </div>
  );
};

export default Donate;
