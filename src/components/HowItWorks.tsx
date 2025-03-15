import { useEffect, useRef } from 'react';
import { Search, UserPlus, Calendar, Award } from 'lucide-react';
import { cn } from '../lib/utils';

const steps = [
  {
    id: 1,
    title: 'Find Opportunities',
    description: 'Search for volunteer opportunities that match your interests, skills, and availability.',
    icon: <Search className="h-6 w-6" />,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 2,
    title: 'Sign Up',
    description: 'Create your profile and apply for the opportunities that interest you most.',
    icon: <UserPlus className="h-6 w-6" />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 3,
    title: 'Volunteer',
    description: 'Attend your scheduled volunteer sessions and make a difference in your community.',
    icon: <Calendar className="h-6 w-6" />,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 4,
    title: 'Track Impact',
    description: 'Record your volunteer hours and see the impact of your contributions over time.',
    icon: <Award className="h-6 w-6" />,
    color: 'from-amber-500 to-orange-500'
  }
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

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

    stepsRef.current.forEach((step, index) => {
      if (step) {
        // Add staggered animation delay
        step.style.animationDelay = `${index * 150}ms`;
        observer.observe(step);
      }
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      stepsRef.current.forEach((step) => {
        if (step) observer.unobserve(step);
      });
    };
  }, []);

  // Reset refs when component re-renders
  stepsRef.current = [];

  return (
    <section className="py-16 relative bg-gradient-to-b from-white to-gray-50" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-blue-50 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-50 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 opacity-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
            How It Works
            <span className="absolute -bottom-2 left-0 right-0 mx-auto w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Getting started with volunteering is easy. Follow these simple steps to begin making a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200 z-0"></div>
          
          {steps.map((step, index) => (
            <div 
              key={step.id}
              ref={el => stepsRef.current[index] = el}
              className={cn(
                "relative z-10 flex flex-col items-center opacity-0",
                "p-6 rounded-xl transition-all duration-300",
                "bg-white shadow-lg hover:shadow-xl border border-gray-100"
              )}
            >
              {/* Step number */}
              <div className="absolute -top-5 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-gray-100">
                <span className="text-sm font-bold text-gray-900">{step.id}</span>
              </div>
              
              {/* Icon */}
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4 mt-4",
                "bg-gradient-to-br shadow-md transform transition-transform duration-300 group-hover:scale-110",
                step.color
              )}>
                <div className="text-white">
                  {step.icon}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 