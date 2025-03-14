import { ArrowRight, CheckCircle, Search } from 'lucide-react';
import OpportunityCard from '../components/OpportunityCard';
import Button from '../components/Button';
import FeaturedOpportunities from '../components/FeaturedOpportunities';
import VolunteerCategories from '../components/VolunteerCategories';
import { Link } from 'react-router-dom';

const successStories = [
  {
    id: 1,
    title: "Teaching Digital Skills to Seniors",
    story: "I helped over 50 seniors learn basic computer skills. Seeing their joy when making their first video call to family was incredibly rewarding.",
    author: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1544654803-b69140b285a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    role: "Digital Literacy Volunteer"
  },
  {
    id: 2,
    title: "Local Park Restoration",
    story: "Our team of volunteers transformed a neglected park into a beautiful community space. We planted 100 trees and created a playground for children.",
    author: "Michael Rodriguez",
    image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f",
    role: "Environmental Project Lead"
  },
  {
    id: 3,
    title: "Food Bank Distribution",
    story: "Working with the local food bank, we provided meals to over 200 families each week. The community's gratitude makes every hour worth it.",
    author: "Emma Thompson",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    role: "Food Bank Coordinator"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-32"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Make a Difference in Your Community
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200">
            Connect with meaningful volunteer opportunities and create positive change in your area.
          </p>
          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-lg p-1">
              <input
                type="text"
                placeholder="Search for volunteer opportunities..."
                className="flex-1 px-4 py-2 focus:outline-none"
              />
              <Button className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Opportunities */}
      <FeaturedOpportunities />

      {/* Impact Stats */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white">10,000+</div>
              <div className="mt-2 text-blue-100">Active Volunteers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">500+</div>
              <div className="mt-2 text-blue-100">Partner Organizations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">50,000+</div>
              <div className="mt-2 text-blue-100">Hours Contributed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <VolunteerCategories />

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Account</h3>
              <p className="text-gray-600">Sign up and join our community of volunteers ready to make a difference.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Find Opportunities</h3>
              <p className="text-gray-600">Browse through various volunteering opportunities that match your interests.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Start Helping</h3>
              <p className="text-gray-600">Apply for opportunities and begin making a positive impact in your community.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{story.title}</h3>
                  <p className="text-gray-600 mb-4 italic">
                    "{story.story}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="text-blue-600 font-medium">{story.author}</p>
                    <p className="text-gray-500 text-sm">{story.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Volunteer With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Make a meaningful impact in your community",
              "Develop new skills and gain experience",
              "Meet like-minded individuals",
              "Flexible scheduling to fit your lifestyle",
              "Track your volunteer hours and impact",
              "Get certificates for your service"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center bg-white p-6 rounded-lg shadow-sm">
                <CheckCircle className="h-6 w-6 text-green-500 mr-4" />
                <span className="text-gray-800">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of volunteers who are creating positive change in their communities.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}