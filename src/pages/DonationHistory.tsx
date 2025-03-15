import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaCalendar, FaHandHoldingHeart, FaBuilding, FaInfoCircle, FaDownload } from 'react-icons/fa';
import { format } from 'date-fns';

interface Donation {
  _id: string;
  amount: number;
  cause: string;
  message?: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  recipientId: {
    _id: string;
    name: string;
    organizationName: string;
    description?: string;
  };
}

const DonationHistory: React.FC = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) return;
    
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/donations/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch donation history');
        }
        
        const data = await response.json();
        if (data.success) {
          setDonations(data.donations);
        } else {
          toast.error(data.message || 'Failed to fetch donation history');
        }
      } catch (error) {
        console.error('Error fetching donation history:', error);
        toast.error(error instanceof Error ? error.message : 'Error fetching donation history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonations();
  }, [token]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getCauseLabel = (cause: string) => {
    const causes: Record<string, string> = {
      'education': 'Education for Children',
      'healthcare': 'Healthcare Support',
      'environment': 'Environmental Protection',
      'elderly': 'Elderly Care',
      'disaster': 'Disaster Relief'
    };
    
    return causes[cause] || cause;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      'card': 'Credit/Debit Card',
      'upi': 'UPI',
      'netbanking': 'Net Banking'
    };
    
    return methods[method] || method;
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleViewDetails = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDonation(null);
  };

  const downloadReceipt = (donation: Donation) => {
    // Create a simple receipt text
    const receiptContent = `
      DONATION RECEIPT
      ----------------
      Date: ${formatDate(donation.createdAt)}
      Transaction ID: ${donation._id}
      
      DONOR INFORMATION
      Name: ${user?.name}
      
      DONATION DETAILS
      Amount: ₹${donation.amount}
      Cause: ${getCauseLabel(donation.cause)}
      Payment Method: ${getPaymentMethodLabel(donation.paymentMethod)}
      Status: ${donation.status.toUpperCase()}
      
      RECIPIENT ORGANIZATION
      Name: ${donation.recipientId.organizationName || donation.recipientId.name}
      
      Thank you for your generous contribution!
    `;
    
    // Create a blob and download it
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donation_receipt_${donation._id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Receipt downloaded successfully');
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600">Please sign in to view your donation history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Donation History</h1>
        <p className="mt-2 text-gray-600">Track all your contributions and their impact</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : donations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-4">
            <FaHandHoldingHeart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Donations Yet</h2>
          <p className="text-gray-600 mb-6">You haven't made any donations yet. Start making a difference today!</p>
          <a
            href="/donate"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Make Your First Donation
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cause
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendar className="mr-2 text-gray-400" />
                        {formatDate(donation.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaBuilding className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {donation.recipientId?.organizationName || donation.recipientId?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{donation.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCauseLabel(donation.cause)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(donation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(donation)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => downloadReceipt(donation)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Donation Details Modal */}
      {showModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Donation Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              {/* Organization Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">RECIPIENT ORGANIZATION</h4>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaBuilding className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h5 className="text-lg font-semibold text-gray-900">
                      {selectedDonation.recipientId.organizationName || selectedDonation.recipientId.name}
                    </h5>
                    {selectedDonation.recipientId.description && (
                      <p className="text-sm text-gray-600 mt-1">{selectedDonation.recipientId.description}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Donation Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">DONATION DETAILS</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-lg font-semibold text-gray-900">₹{selectedDonation.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-base text-gray-900">{formatDate(selectedDonation.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cause</p>
                    <p className="text-base text-gray-900">{getCauseLabel(selectedDonation.cause)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="text-base text-gray-900">{getPaymentMethodLabel(selectedDonation.paymentMethod)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedDonation.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="text-base text-gray-900 font-mono">{selectedDonation._id}</p>
                  </div>
                </div>
              </div>
              
              {/* Message */}
              {selectedDonation.message && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">YOUR MESSAGE</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700 italic">"{selectedDonation.message}"</p>
                  </div>
                </div>
              )}
              
              {/* Impact Info */}
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaInfoCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Impact of Your Donation</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Your contribution helps {selectedDonation.recipientId.organizationName || selectedDonation.recipientId.name} continue their important work in {getCauseLabel(selectedDonation.cause).toLowerCase()}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => downloadReceipt(selectedDonation)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaDownload className="mr-2" /> Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationHistory; 