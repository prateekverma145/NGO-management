import { Link, useNavigate } from 'react-router-dom';
import OpportunityCard from './OpportunityCard';
import { featuredOpportunities } from '../data/opportunities';

export default function FeaturedOpportunities() {
  const navigate = useNavigate();

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Opportunities</h2>
          <Link 
            to="/opportunities" 
            className="text-gray-600 hover:text-gray-900"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              {...opportunity}
              onClick={() => navigate(`/opportunities/${opportunity.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}