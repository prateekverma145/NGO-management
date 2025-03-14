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

    try {
      const response = await fetch('http://localhost:5000/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/signin');
          return;
        }
        throw new Error('Failed to create opportunity');
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Opportunity created successfully!');
        navigate('/opportunities');
      } else {
        toast.error(data.message || 'Failed to create opportunity');
      }
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast.error('Error creating opportunity');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component code
};

export default CreateOpportunity;