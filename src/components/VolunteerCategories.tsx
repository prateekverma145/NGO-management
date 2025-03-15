import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { Heart, BookOpen, Leaf, Users, Home, Briefcase, Globe, Music } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Health & Wellness',
    icon: <Heart className="h-6 w-6" />,
    color: 'from-red-500 to-pink-500',
    bgLight: 'bg-red-50',
    textColor: 'text-red-600',
    count: 42
  },
  {
    id: 2,
    name: 'Education',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'from-blue-500 to-indigo-500',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    count: 38
  },
  {
    id: 3,
    name: 'Environment',
    icon: <Leaf className="h-6 w-6" />,
    color: 'from-green-500 to-emerald-500',
    bgLight: 'bg-green-50',
    textColor: 'text-green-600',
    count: 29
  },
  {
    id: 4,
    name: 'Community',
    icon: <Users className="h-6 w-6" />,
    color: 'from-purple-500 to-violet-500',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-600',
    count: 45
  },
  {
    id: 5,
    name: 'Housing',
    icon: <Home className="h-6 w-6" />,
    color: 'from-yellow-500 to-amber-500',
    bgLight: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    count: 23
  },
  {
    id: 6,
    name: 'Professional',
    icon: <Briefcase className="h-6 w-6" />,
    color: 'from-gray-600 to-gray-700',
    bgLight: 'bg-gray-50',
    textColor: 'text-gray-600',
    count: 31
  },
  {
    id: 7,
    name: 'International',
    icon: <Globe className="h-6 w-6" />,
    color: 'from-cyan-500 to-teal-500',
    bgLight: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    count: 18
  },
  {
    id: 8,
    name: 'Arts & Culture',
    icon: <Music className="h-6 w-6" />,
    color: 'from-orange-500 to-amber-500',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-600',
    count: 27
  }
];

export default function VolunteerCategories() {
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

    const categories = document.querySelectorAll('.category-card');
    categories.forEach((category, index) => {
      // Add staggered animation delay
      (category as HTMLElement).style.animationDelay = `${index * 100}ms`;
      observer.observe(category);
    });

    return () => {
      categories.forEach((category) => {
        observer.unobserve(category);
      });
    };
  }, []);

  return (
    <section className="py-16 relative" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-50 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-purple-50 rounded-full opacity-30 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
            Volunteer Categories
            <span className="absolute -bottom-2 left-0 right-0 mx-auto w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Explore different ways to make an impact based on your interests and skills
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.id} 
              to={`/opportunities?category=${category.name.toLowerCase()}`}
              className={cn(
                "category-card opacity-0 group",
                "flex flex-col items-center p-6 rounded-xl transition-all duration-300",
                "bg-white hover:bg-gradient-to-br hover:shadow-xl border border-gray-100",
                `hover:${category.bgLight} hover:border-transparent`
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                "bg-gradient-to-br shadow-md transform transition-transform duration-300 group-hover:scale-110",
                category.color
              )}>
                <div className="text-white">
                  {category.icon}
                </div>
              </div>
              <h3 className={cn(
                "text-lg font-semibold text-gray-900 mb-1 transition-colors duration-300",
                `group-hover:${category.textColor}`
              )}>
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.count} opportunities</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}