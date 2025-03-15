import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CallToAction() {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section 
      ref={sectionRef}
      className="py-20 relative opacity-0"
    >
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-90"></div>
      
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-[-1]" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
          backgroundAttachment: "fixed"
        }}
      ></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Ready to Make a <span className="relative inline-block">
              Difference?
              <span className="absolute bottom-1 left-0 w-full h-1 bg-white opacity-50 rounded-full"></span>
            </span>
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-10">
            Join thousands of volunteers who are creating positive change in communities around the world. Your journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-indigo-600 bg-white rounded-lg shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/opportunities"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-transparent border-2 border-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300"
            >
              Browse Opportunities
            </Link>
          </div>
        </div>
      </div>
      
      {/* Wave shape divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg 
          className="relative block w-full h-16 sm:h-24" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
} 