import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const CreateOpportunity: React.FC = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in or not an NGO
  React.useEffect(() => {
    if (!token) {
      toast.error('Please login to create opportunities');
      navigate('/signin');
      return;
    }
    if (user?.userType !== 'ngo') {
      toast.error('Only NGOs can create opportunities');
      navigate('/opportunities');
      return;
    }
  }, [token, user, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    location: '',
    date: '',
    image: '',
    category: 'Food & Hunger',
    volunteers: '',
    description: '',
    hoursPerWeek: '',
    deadline: '',
    impact: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      toast.error('Please login to create opportunities');
      navigate('/signin');
      return;
    }

    // Debug: Log the form data before submission with specific focus on required fields
    console.log('Form data being submitted:', formData);
    console.log('Required fields check:', {
      impact: formData.impact,
      deadline: formData.deadline,
      hoursPerWeek: formData.hoursPerWeek,
      hasImpact: !!formData.impact,
      hasDeadline: !!formData.deadline,
      hasHoursPerWeek: !!formData.hoursPerWeek
    });

    // Validate required fields
    const requiredFields = ['title', 'organization', 'location', 'date', 'image', 'category', 'volunteers', 'description', 'hoursPerWeek', 'deadline', 'impact'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      setLoading(false);
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Create a copy of the form data with explicit field assignments to ensure all fields are included
    const formDataToSubmit = {
      title: formData.title,
      organization: formData.organization,
      location: formData.location,
      date: formData.date,
      image: formData.image,
      category: formData.category,
      volunteers: Number(formData.volunteers), // Convert to number
      description: formData.description,
      hoursPerWeek: String(formData.hoursPerWeek).trim(), // Ensure it's a string and trim whitespace
      deadline: String(formData.deadline).trim(), // Ensure it's a string and trim whitespace
      impact: String(formData.impact).trim() // Ensure it's a string and trim whitespace
    };

    console.log('Data being sent to server:', formDataToSubmit);

    try {
      const response = await fetch('http://localhost:5000/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formDataToSubmit)
      });

      // Debug: Log the response status and request body
      console.log('Response status:', response.status);
      console.log('Request body sent:', JSON.stringify(formDataToSubmit));

      // Try to get the response body for more details
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/signin');
          return;
        }
        
        // Show specific error message if available
        if (responseData.message) {
          toast.error(responseData.message);
          if (responseData.missingFields) {
            console.error('Missing fields reported by server:', responseData.missingFields);
          }
        } else {
          toast.error('Failed to create opportunity');
        }
        return;
      }

      if (responseData.success) {
        toast.success('Opportunity created successfully!');
        navigate('/opportunities');
      } else {
        toast.error(responseData.message || 'Failed to create opportunity');
      }
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast.error('Error creating opportunity');
    } finally {
      setLoading(false);
    }
  };

  // Test function to check if the backend is receiving the data correctly
  const testEchoEndpoint = async () => {
    if (!token) return;

    const testData = {
      impact: 'Test impact',
      deadline: '2023-12-31',
      hoursPerWeek: '5-10 hours',
      title: 'Test Opportunity'
    };

    try {
      const response = await fetch('http://localhost:5000/api/test-echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      console.log('Echo test response:', data);
      
      if (data.success) {
        toast.success('Echo test successful!');
      } else {
        toast.error('Echo test failed');
      }
    } catch (error) {
      console.error('Echo test error:', error);
      toast.error('Echo test error');
    }
  };

  // Test function to check if the opportunity creation endpoint is working
  const testOpportunityEndpoint = async () => {
    if (!token) return;

    // Create a complete test opportunity with all required fields
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
      console.log('Opportunity test response:', data);
      
      if (data.success) {
        toast.success('Opportunity test successful! All required fields present.');
      } else {
        toast.error(`Opportunity test failed: ${data.message}`);
        console.log('Missing fields:', data.missingFields);
      }
    } catch (error) {
      console.error('Opportunity test error:', error);
      toast.error('Opportunity test error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h1 className="text-2xl font-bold mb-6">Create New Volunteer Opportunity</h1>
      
      {/* Add test buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          onClick={testEchoEndpoint}
          className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Test API Connection
        </button>
        <button
          type="button"
          onClick={testOpportunityEndpoint}
          className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
          Test Opportunity Fields
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
            <input
              type="text"
              name="organization"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.organization}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Food & Hunger">Food & Hunger</option>
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Social Services">Social Services</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="deadline"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.deadline}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">The last date volunteers can register for this opportunity</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours Per Week <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="hoursPerWeek"
              required
              placeholder="e.g., 5-10 hours"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.hoursPerWeek}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">Estimated time commitment per week</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Volunteers Needed</label>
            <input
              type="number"
              name="volunteers"
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.volunteers}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              name="image"
              required
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.image}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Impact <span className="text-red-500">*</span>
          </label>
          <textarea
            name="impact"
            required
            rows={3}
            placeholder="Describe the impact this opportunity will have..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.impact}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500 mt-1">Explain how this opportunity will make a difference</p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/opportunities')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-4 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOpportunity;