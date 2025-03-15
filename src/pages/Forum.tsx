import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    userType: string;
    organizationName?: string;
  };
  relatedOpportunity?: {
    _id: string;
    title: string;
  };
  replies: Array<{
    _id: string;
    content: string;
    author: {
      _id: string;
      name: string;
      userType: string;
      organizationName?: string;
    };
    createdAt: string;
  }>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const Forum: React.FC = () => {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    relatedOpportunity: '',
    tags: ''
  });
  const [opportunities, setOpportunities] = useState<Array<{ _id: string; title: string }>>([]);

  useEffect(() => {
    fetchPosts();
    if (token) {
      fetchOpportunities();
    }
  }, [token]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/forum');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Ensure posts is always an array
        setPosts(Array.isArray(data.data) ? data.data : []);
      } else {
        console.error('Failed to load forum posts:', data.message);
        toast.error(data.message || 'Failed to load forum posts');
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      toast.error('Error loading forum posts. Please try again later.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/opportunities', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Ensure opportunities is always an array
        const opportunitiesData = Array.isArray(data.data) ? data.data : [];
        setOpportunities(opportunitiesData.map((opp: any) => ({ 
          _id: opp._id, 
          title: opp.title 
        })));
      } else {
        console.error('Failed to load opportunities:', data.message);
        setOpportunities([]);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setOpportunities([]);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to create a post');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newPost,
          tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Post created successfully');
        setNewPost({ title: '', content: '', relatedOpportunity: '', tags: '' });
        setShowNewPostForm(false);
        fetchPosts();
      } else {
        toast.error(data.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error creating post');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-gray-600 mt-1">Discuss volunteer opportunities and share experiences</p>
        </div>
        {token && (
          <button
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {showNewPostForm ? 'Cancel' : 'New Post'}
          </button>
        )}
      </div>

      {showNewPostForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Related Opportunity (Optional)</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newPost.relatedOpportunity}
                onChange={(e) => setNewPost({ ...newPost, relatedOpportunity: e.target.value })}
              >
                <option value="">None</option>
                {opportunities.map(opp => (
                  <option key={opp._id} value={opp._id}>{opp.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., question, advice, experience"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
          <p className="text-gray-600">Be the first to start a discussion!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <Link to={`/forum/${post._id}`} className="text-xl font-semibold hover:text-blue-600">
                  {post.title}
                </Link>
                
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <span className="font-medium">
                    {post.author.userType === 'ngo' 
                      ? post.author.organizationName || post.author.name
                      : post.author.name}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(post.createdAt)}</span>
                  
                  {post.relatedOpportunity && (
                    <>
                      <span className="mx-2">•</span>
                      <Link 
                        to={`/opportunities/${post.relatedOpportunity._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {post.relatedOpportunity.title}
                      </Link>
                    </>
                  )}
                </div>
                
                <p className="mt-3 text-gray-700 line-clamp-3">{post.content}</p>
                
                {post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                </div>
                <Link 
                  to={`/forum/${post._id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Discussion →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forum;