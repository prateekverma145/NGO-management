import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';

interface Reply {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    userType: string;
    organizationName?: string;
  };
  createdAt: string;
}

interface ForumPostData {
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
  replies: Reply[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const ForumPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<ForumPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: '',
    content: '',
    tags: ''
  });

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/forum/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPost(data.data);
        // Initialize edit form with current post data
        setEditedPost({
          title: data.data.title,
          content: data.data.content,
          tags: data.data.tags.join(', ')
        });
      } else {
        toast.error(data.message || 'Failed to load post');
        navigate('/forum');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Error loading post. Please try again later.');
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to reply');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`http://localhost:5000/api/forum/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: replyContent })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Reply added successfully');
        setReplyContent('');
        setPost(data.data);
      } else {
        toast.error(data.message || 'Failed to add reply');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Error adding reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to edit');
      return;
    }

    if (!editedPost.title.trim() || !editedPost.content.trim()) {
      toast.error('Title and content cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`http://localhost:5000/api/forum/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editedPost.title,
          content: editedPost.content,
          tags: editedPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Post updated successfully');
        setPost(data.data);
        setEditing(false);
      } else {
        toast.error(data.message || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Error updating post');
    } finally {
      setSubmitting(false);
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

  const canEdit = () => {
    return user && post && user._id === post.author._id;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Post not found</h2>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/forum" className="text-blue-600 hover:underline flex items-center justify-center">
            <ArrowLeft size={16} className="mr-1" /> Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <Link to="/forum" className="text-blue-600 hover:underline flex items-center mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to Forum
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {editing ? (
          <div className="p-6">
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editedPost.title}
                  onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editedPost.content}
                  onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., question, advice, experience"
                  value={editedPost.tags}
                  onChange={(e) => setEditedPost({ ...editedPost, tags: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center"
                >
                  <X size={16} className="mr-1" /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
                >
                  <Save size={16} className="mr-1" /> {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">{post.title}</h1>
              {canEdit() && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-gray-600 hover:text-blue-600 p-1"
                  aria-label="Edit post"
                >
                  <Edit size={18} />
                </button>
              )}
            </div>
            
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
            
            <div className="mt-6 text-gray-700 whitespace-pre-line">
              {post.content}
            </div>
            
            {post.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
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
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
        </h2>
        
        {post.replies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
            No replies yet. Be the first to reply!
          </div>
        ) : (
          <div className="space-y-4">
            {post.replies.map(reply => (
              <div key={reply._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="font-medium">
                    {reply.author.userType === 'ngo' 
                      ? reply.author.organizationName || reply.author.name
                      : reply.author.name}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(reply.createdAt)}</span>
                </div>
                
                <div className="text-gray-700 whitespace-pre-line">
                  {reply.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {token && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Add a Reply</h3>
          <form onSubmit={handleSubmitReply} className="space-y-4">
            <div>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Write your reply here..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {submitting ? 'Submitting...' : 'Submit Reply'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForumPost; 