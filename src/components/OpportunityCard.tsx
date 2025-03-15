import { Calendar, MapPin, Users } from 'lucide-react';
import Button from './Button';
import { Opportunity } from '../types/opportunity';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface OpportunityCardProps extends Opportunity {
  onClick?: () => void;
}

export default function OpportunityCard({
  title,
  organization,
  location,
  date,
  image,
  category,
  volunteers,
  onClick,
}: OpportunityCardProps) {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-[0_20px_35px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_35px_rgba(0,0,0,0.3)] shadow-[0_10px_25px_rgba(0,0,0,0.07)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.2)] border border-gray-100/80 dark:border-gray-700/80">
      <div className="relative overflow-hidden h-52">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ 
            objectFit: 'cover',
            filter: 'contrast(1.15) brightness(1.05) saturate(1.1)'
          }}
          onError={(e) => {
            e.currentTarget.src = '/fallback-image.jpg';
          }}
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50/90 dark:bg-blue-900/90 backdrop-blur-sm rounded-full shadow-sm border border-blue-100/50 dark:border-blue-700/50">
            {category}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 z-20 transform transition-transform duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex justify-between items-center">
            <span className="text-white/90 text-sm font-medium flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1 text-blue-200" />
              {date}
            </span>
            <span className="text-white/90 text-sm font-medium flex items-center">
              <Users className="h-3.5 w-3.5 mr-1 text-blue-200" />
              {volunteers} needed
            </span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
          <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">{organization}</p>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
              <MapPin className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
        
        <div>
          <Link to="/opportunities" className="w-full block">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform active:scale-[0.98] shadow-md hover:shadow-lg dark:shadow-indigo-900/30"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}