import { Calendar, MapPin, Users } from 'lucide-react';
import Button from './Button';
import { Opportunity } from '../types/opportunity';


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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = '/fallback-image.jpg'; // Add a fallback image
        }}
      />
      <div className="p-6">
        <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
          {category}
        </span>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{organization}</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-500">
            <MapPin className="h-5 w-5 mr-2" />
            {location}
          </div>
          <div className="flex items-center text-gray-500">
            <Calendar className="h-5 w-5 mr-2" />
            {date}
          </div>
          <div className="flex items-center text-gray-500">
            <Users className="h-5 w-5 mr-2" />
            {volunteers} volunteers needed
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={onClick} className="w-full">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}