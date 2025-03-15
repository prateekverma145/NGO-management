import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const TestOpportunityForm: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  // Simple test opportunity with all required fields
  const testOpportunity = {
    title: 'Test Opportunity',
    organization: 'Test Organization',
    location: 'Test Location',
    date: '2023-12-31',
    image: 'https://example.com/image.jpg',
    category: 'Food & Hunger',
    volunteers: 5,
    description: 'Test description',
    hoursPerWeek: '5-10 hours',
    deadline: '2023-12-15',
    impact: 'Test impact description'
  };

  const testDirectSubmission = async () => {
    if (!token) {
      toast.error('Please login to test');
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const response = await fetch('http://localhost:5000/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testOpportunity)
      });

      const data = await response.json();
      setResponse(data);
      
      if (response.ok && data.success) {
        toast.success('Test opportunity created successfully!');
      } else {
        toast.error(data.message || 'Failed to create test opportunity');
      }
    } catch (error) {
      console.error('Error in test:', error);
      toast.error('Error in test');
    } finally {
      setLoading(false);
    }
  };

  const testEchoEndpoint = async () => {
    if (!token) {
      toast.error('Please login to test');
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const response = await fetch('http://localhost:5000/api/test-echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testOpportunity)
      });

      const data = await response.json();
      setResponse(data);
      
      if (data.success) {
        toast.success('Echo test successful!');
      } else {
        toast.error('Echo test failed');
      }
    } catch (error) {
      console.error('Error in echo test:', error);
      toast.error('Error in echo test');
    } finally {
      setLoading(false);
    }
  };

  const testOpportunityEndpoint = async () => {
    if (!token) {
      toast.error('Please login to test');
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const response = await fetch('http://localhost:5000/api/test-opportunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testOpportunity)
      });

      const data = await response.json();
      setResponse(data);
      
      if (data.success) {
        toast.success('Opportunity test successful!');
      } else {
        toast.error(`Opportunity test failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error in opportunity test:', error);
      toast.error('Error in opportunity test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h1 className="text-2xl font-bold mb-6">Test Opportunity Form</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Test Data</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(testOpportunity, null, 2)}
        </pre>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          onClick={testDirectSubmission}
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Testing...' : 'Test Direct Submission'}
        </button>
        
        <button
          type="button"
          onClick={testEchoEndpoint}
          disabled={loading}
          className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-300"
        >
          {loading ? 'Testing...' : 'Test Echo Endpoint'}
        </button>
        
        <button
          type="button"
          onClick={testOpportunityEndpoint}
          disabled={loading}
          className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-300"
        >
          {loading ? 'Testing...' : 'Test Opportunity Endpoint'}
        </button>
      </div>
      
      {response && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Response</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestOpportunityForm; 