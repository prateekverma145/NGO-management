import { ArrowRight, CheckCircle, Search, MapPin, Heart, Award, Users } from 'lucide-react';
import OpportunityCard from '../components/OpportunityCard';
import Button from '../components/Button';
import FeaturedOpportunities from '../components/FeaturedOpportunities';
import VolunteerCategories from '../components/VolunteerCategories';
import LocationMap from '../components/LocationMap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-40 md:py-52"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url("https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fadeIn">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl drop-shadow-lg">
              <span className="block">Make a Difference</span>
              <span className="block text-blue-300">In Your Community</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200 leading-relaxed">
              Connect with meaningful volunteer opportunities and create positive change in your area.
            </p>
            <div className="mt-10 max-w-xl mx-auto">
              <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-xl">
                <input
                  type="text"
                  placeholder="Search for volunteer opportunities..."
                  className="flex-1 px-6 py-3 bg-transparent rounded-full focus:outline-none"
                />
                <Button className="flex items-center rounded-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="animate-bounce mb-8">
              <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Opportunities */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white/0 pointer-events-none"></div>
        <FeaturedOpportunities />
      </div>

      {/* Location Map Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Find Help Near You</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover NGOs, food banks, blood donation centers, and shelters in your area ready to assist you.
            </p>
          </div>
          <div className="rounded-2xl shadow-2xl overflow-hidden">
            <LocationMap />
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-800 opacity-20 mix-blend-multiply"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Together, we're making a real difference in communities across the country.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-5xl font-bold text-white mb-2">10,000+</div>
              <div className="text-lg text-blue-100">Active Volunteers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div className="text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-lg text-blue-100">Partner Organizations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="text-5xl font-bold text-white mb-2">50,000+</div>
              <div className="text-lg text-blue-100">Hours Contributed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/0 pointer-events-none"></div>
        <VolunteerCategories />
      </div>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">How It Works</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Getting started is easy. Follow these simple steps to begin your volunteering journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 transform -translate-y-1/2 z-0"></div>
            <div className="relative z-10">
              <div className="bg-white rounded-xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Create Account</h3>
                <p className="text-gray-600">Sign up and join our community of volunteers ready to make a difference.</p>
              </div>
            </div>
            <div className="relative z-10">
              <div className="bg-white rounded-xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Find Opportunities</h3>
                <p className="text-gray-600">Browse through various volunteering opportunities that match your interests.</p>
              </div>
            </div>
            <div className="relative z-10">
              <div className="bg-white rounded-xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Start Helping</h3>
                <p className="text-gray-600">Apply for opportunities and begin making a positive impact in your community.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white pointer-events-none h-32"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Success Stories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real stories from volunteers who have made a difference in their communities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-white font-medium text-sm bg-blue-600 rounded-full px-3 py-1 inline-block">
                      {story.role}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{story.title}</h3>
                  <p className="text-gray-600 mb-4 italic leading-relaxed">
                    "{story.story}"
                  </p>
                  <div className="border-t pt-4 flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {story.author.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-blue-600 font-medium">{story.author}</p>
                      <p className="text-gray-500 text-sm">{story.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Why Volunteer With Us?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the many benefits of joining our volunteer community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Make a meaningful impact in your community",
              "Develop new skills and gain experience",
              "Meet like-minded individuals",
              "Flexible scheduling to fit your lifestyle",
              "Track your volunteer hours and impact",
              "Get certificates for your service"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-full p-3 mr-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-gray-800 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-700 opacity-20"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23FFFFFF\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join thousands of volunteers who are creating positive change in their communities.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-full text-white bg-transparent hover:bg-white hover:text-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}