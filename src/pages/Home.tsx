import { ArrowRight, CheckCircle, Search, MapPin, Heart, Award, Users, ChevronDown } from 'lucide-react';
import OpportunityCard from '../components/OpportunityCard';
import Button from '../components/Button';
import FeaturedOpportunities from '../components/FeaturedOpportunities';
import VolunteerCategories from '../components/VolunteerCategories';
import LocationMap from '../components/LocationMap';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { cn } from '../lib/utils';

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

const impactStats = [
  { 
    id: 1, 
    icon: <Users className="h-8 w-8 text-white" />, 
    value: "10,000+", 
    label: "Active Volunteers",
    startValue: 0,
    endValue: 10000,
    prefix: "",
    suffix: "+"
  },
  { 
    id: 2, 
    icon: <Heart className="h-8 w-8 text-white" />, 
    value: "500+", 
    label: "Partner Organizations",
    startValue: 0,
    endValue: 500,
    prefix: "",
    suffix: "+"
  },
  { 
    id: 3, 
    icon: <Award className="h-8 w-8 text-white" />, 
    value: "50,000+", 
    label: "Hours Contributed",
    startValue: 0,
    endValue: 50000,
    prefix: "",
    suffix: "+"
  }
];

// CountUp component for animated statistics
function CountUp({ start = 0, end = 100, duration = 2, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const stepRef = useRef(1);
  const timeRef = useRef(Math.floor(duration * 1000 / (end - start)));

  useEffect(() => {
    countRef.current = start;
    const target = end;
    const step = Math.ceil((target - start) / 30);
    stepRef.current = step;
    
    const timer = setInterval(() => {
      if (countRef.current + step >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        countRef.current += step;
        setCount(countRef.current);
      }
    }, timeRef.current);
    
    return () => clearInterval(timer);
  }, [start, end, duration]);

  return <>{prefix}{Math.floor(count).toLocaleString()}{suffix}</>;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [animatedStats, setAnimatedStats] = useState<{[key: string]: boolean}>({});
  const statsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const successStoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Check if stats section is in view
      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setAnimatedStats(prev => ({...prev, stats: true}));
        }
      }
    };
    
    // Set up intersection observer for animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-40 md:py-52"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fadeIn">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl drop-shadow-lg">
              <span className="block">Make a Difference</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">In Your Community</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200 leading-relaxed">
              Connect with meaningful volunteer opportunities and create positive change in your area.
            </p>
            <div className="mt-10 max-w-xl mx-auto">
              <div className="flex  invisible items-center bg-white/10 backdrop-blur-md rounded-full p-1.5 shadow-xl border border-white/20">
                <input
                  type="text"
                  placeholder="Search for volunteer opportunities..."
                  className="flex-1 px-6 py-3 bg-transparent rounded-full text-white placeholder-gray-300 focus:outline-none"
                />
                <Button 
                  className="flex items-center rounded-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                >
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
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden animate-on-scroll opacity-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Find Help Near You</span>
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
      <div ref={statsRef} className="bg-gradient-to-r from-blue-700 to-indigo-900 py-20 relative overflow-hidden animate-on-scroll opacity-0">
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
            {impactStats.map((stat) => (
              <div 
                key={stat.id} 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform transition-all duration-300 hover:scale-105 hover:bg-white/15 border border-white/10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 mb-6">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold text-white mb-2">
                  {animatedStats.stats ? (
                    <CountUp 
                      start={stat.startValue} 
                      end={stat.endValue} 
                      prefix={stat.prefix} 
                      suffix={stat.suffix} 
                      duration={2.5} 
                    />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-lg text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="relative py-16 animate-on-scroll opacity-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/0 pointer-events-none"></div>
        <VolunteerCategories />
      </div>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden animate-on-scroll opacity-0">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">How It Works</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Getting started is easy. Follow these simple steps to begin your volunteering journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 transform -translate-y-1/2 z-0"></div>
            <div className="relative z-10">
              <div className="bg-white rounded-xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Create Account</h3>
                <p className="text-gray-600">Sign up and join our community of volunteers ready to make a difference.</p>
              </div>
            </div>
            <div className="relative z-10">
              <div className="bg-white rounded-xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Find Opportunities</h3>
                <p className="text-gray-600">Browse through various volunteering opportunities that match your interests.</p>
              </div>
            </div>
            <div className="relative z-10">
              <div className="bg-white rounded-xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
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
      <section ref={successStoriesRef} className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden animate-on-scroll opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Success Stories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from volunteers who have made a meaningful impact in their communities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div 
                key={story.id} 
                className={cn(
                  "bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl border border-gray-100 flex flex-col",
                  "animate-on-scroll opacity-0"
                )}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.title} 
                    className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white">{story.title}</h3>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-gray-600 mb-4 flex-1">"{story.story}"</p>
                  <div className="flex items-center mt-auto">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{story.author}</p>
                      <p className="text-sm text-blue-600">{story.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden animate-on-scroll opacity-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Why Volunteer With Us</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the many benefits of joining our volunteer community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Make a Difference</h3>
              <p className="text-gray-600">Create positive change in your community and help those in need.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Build Connections</h3>
              <p className="text-gray-600">Meet like-minded individuals and form meaningful relationships.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Gain Experience</h3>
              <p className="text-gray-600">Develop new skills and enhance your resume with valuable experience.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Personal Growth</h3>
              <p className="text-gray-600">Boost your confidence and find purpose through helping others.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden animate-on-scroll opacity-0">
        <div className="absolute inset-0 bg-blue-700 opacity-20 mix-blend-multiply"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23FFFFFF\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Make an Impact?</h2>
                <p className="text-lg text-blue-100 mb-6">
                  Join our community of volunteers today and start making a difference in your area.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="px-8 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Sign Up Now
                  </Button>
                  <Button 
                    variant="outlined"
                    className="px-8 py-3 bg-transparent border border-white text-white hover:bg-white/10 rounded-full font-medium transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Volunteers working together" 
                  className="rounded-xl shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}