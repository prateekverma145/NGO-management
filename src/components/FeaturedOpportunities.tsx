import { Link } from 'react-router-dom';
import OpportunityCard from './OpportunityCard';
import { featuredOpportunities } from '../data/opportunities';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

export default function FeaturedOpportunities() {
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

    const cards = document.querySelectorAll('.opportunity-card');
    cards.forEach((card, index) => {
      // Add staggered animation delay
      (card as HTMLElement).style.animationDelay = `${index * 150}ms`;
      observer.observe(card);
    });

    return () => {
      cards.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section className="py-16 relative" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-100 dark:bg-blue-900/30 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/30 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 relative inline-block">
              Featured Opportunities
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-full"></span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Discover ways to make a difference in your community</p>
          </div>
          <Link 
            to="/opportunities" 
            className="group flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-300"
          >
            <span>View All</span>
            <ArrowRight className="ml-1 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredOpportunities.map((opportunity, index) => (
            <div 
              key={opportunity.id} 
              className={cn(
                "opportunity-card opacity-0 transform translate-y-8",
                "hover:translate-y-[-4px] transition-all duration-500"
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <OpportunityCard {...opportunity} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}