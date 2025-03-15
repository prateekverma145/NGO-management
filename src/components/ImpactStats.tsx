import { useEffect, useRef, useState } from 'react';
import { Award, Clock, Users, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

// CountUp component for animated statistics
function CountUp({ end, duration = 2000, delay = 0 }: { end: number; duration?: number; delay?: number }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const startAnimation = () => {
      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        
        countRef.current = Math.floor(easedProgress * end);
        setCount(countRef.current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      setTimeout(() => {
        rafRef.current = requestAnimationFrame(animate);
      }, delay);
    };

    startAnimation();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [end, duration, delay]);

  // Easing function for smoother animation
  const easeOutQuart = (x: number): number => {
    return 1 - Math.pow(1 - x, 4);
  };

  return <>{count.toLocaleString()}</>;
}

const stats = [
  {
    id: 1,
    value: 15000,
    label: 'Volunteers',
    icon: <Users className="h-6 w-6" />,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 2,
    value: 250000,
    label: 'Hours Donated',
    icon: <Clock className="h-6 w-6" />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 3,
    value: 1200,
    label: 'Organizations',
    icon: <Award className="h-6 w-6" />,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 4,
    value: 500,
    label: 'Communities Served',
    icon: <Heart className="h-6 w-6" />,
    color: 'from-red-500 to-pink-500'
  }
];

export default function ImpactStats() {
  const [animatedStats, setAnimatedStats] = useState<{[key: string]: boolean}>({});
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setAnimatedStats(prev => ({ ...prev, [id]: true }));
              entry.target.classList.add('animate-fadeIn');
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    statsRefs.current.forEach((stat) => {
      if (stat) {
        observer.observe(stat);
      }
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      statsRefs.current.forEach((stat) => {
        if (stat) observer.unobserve(stat);
      });
    };
  }, []);

  // Reset refs when component re-renders
  statsRefs.current = [];

  return (
    <section 
      ref={sectionRef}
      className="py-16 relative bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-blue-50 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-50 rounded-full opacity-30 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
            Our Impact
            <span className="absolute -bottom-2 left-0 right-0 mx-auto w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Together, we're making a difference in communities around the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              ref={el => statsRefs.current[index] = el}
              data-id={stat.id}
              className={cn(
                "relative flex flex-col items-center p-8 rounded-xl opacity-0",
                "bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100",
                "transform hover:-translate-y-1"
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Icon */}
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-6",
                "bg-gradient-to-br shadow-md",
                stat.color
              )}>
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>
              
              {/* Value */}
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {animatedStats[stat.id] ? (
                  <CountUp end={stat.value} delay={index * 200} />
                ) : (
                  '0'
                )}
              </h3>
              
              {/* Label */}
              <p className="text-lg text-gray-600 text-center">
                {stat.label}
              </p>
              
              {/* Decorative element */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r rounded-b-xl opacity-70" style={{ 
                backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                '--tw-gradient-from': `rgb(var(--${stat.color.split('-')[1].split(' ')[0]}-500))`,
                '--tw-gradient-to': `rgb(var(--${stat.color.split('-')[2].split(' ')[0]}-500))`,
              }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 