import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '../lib/utils';

const successStories = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Education Volunteer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'Volunteering as a tutor has been the most rewarding experience of my life. Seeing the children's progress and knowing I played a part in their success gives me immense joy.',
    impact: 'Helped 15 students improve their reading skills'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Environmental Activist',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'What started as a weekend beach cleanup has turned into a passion for environmental conservation. Together with other volunteers, we've made a visible difference in our community.',
    impact: 'Organized 12 community cleanup events'
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Healthcare Volunteer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'The connections I've made with patients while volunteering at the hospital have changed my perspective on life. It's taught me empathy and compassion in ways I never expected.',
    impact: 'Provided support to over 200 patients'
  },
  {
    id: 4,
    name: 'David Rodriguez',
    role: 'Community Organizer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'Building a community garden in our neighborhood has brought people together across generations and backgrounds. It's amazing what we can accomplish when we work together.',
    impact: 'Created a garden that feeds 30 families'
  }
];

export default function SuccessStories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);

  const nextStory = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === successStories.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevStory = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? successStories.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextStory();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-16 relative bg-gradient-to-b from-white to-gray-50 opacity-0"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-indigo-50 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-blue-50 rounded-full opacity-30 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
            Success Stories
            <span className="absolute -bottom-2 left-0 right-0 mx-auto w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Real stories from volunteers who have made a meaningful impact in their communities
          </p>
        </div>

        <div 
          ref={storiesRef}
          className="relative max-w-5xl mx-auto overflow-hidden"
        >
          <div 
            className={cn(
              "transition-all duration-500 ease-in-out",
              isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            )}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="lg:flex">
                {/* Image */}
                <div className="lg:w-2/5 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-blue-500 opacity-90 mix-blend-multiply"></div>
                  <img 
                    src={successStories[activeIndex].image} 
                    alt={successStories[activeIndex].name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Quote className="h-20 w-20 text-white opacity-20" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="lg:w-3/5 p-8 lg:p-12">
                  <div className="mb-6">
                    <blockquote className="text-xl italic text-gray-700 leading-relaxed mb-6">
                      "{successStories[activeIndex].quote}"
                    </blockquote>
                    <div className="flex items-center">
                      <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full mr-4"></div>
                      <p className="text-gray-500 font-medium">Impact: {successStories[activeIndex].impact}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-100">
                      <img 
                        src={successStories[activeIndex].image} 
                        alt={successStories[activeIndex].name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{successStories[activeIndex].name}</h4>
                      <p className="text-indigo-600">{successStories[activeIndex].role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button 
              onClick={prevStory}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-indigo-600 focus:outline-none"
              aria-label="Previous story"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div className="flex space-x-2">
              {successStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (isAnimating) return;
                    setIsAnimating(true);
                    setActiveIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    index === activeIndex 
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 w-6" 
                      : "bg-gray-300 hover:bg-gray-400"
                  )}
                  aria-label={`Go to story ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextStory}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-indigo-600 focus:outline-none"
              aria-label="Next story"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 