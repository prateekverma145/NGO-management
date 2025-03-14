import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  count: number;
}

const categories: Category[] = [
  {
    id: 'education',
    name: 'Education',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Support learning initiatives and help shape futures',
    count: 25
  },
  {
    id: 'environment',
    name: 'Environment',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Protect and preserve our natural world',
    count: 18
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Make a difference in medical and wellness services',
    count: 20
  },
  {
    id: 'community',
    name: 'Community',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Build stronger local communities together',
    count: 30
  }
];

const VolunteerCategories: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Volunteer Categories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/opportunities?category=${category.id}`}
              className="group relative overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 w-full">
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-30 transition-opacity z-10" />
                
                {/* Background image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
                
                {/* Content overlay */}
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">
                      {category.count} opportunities
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolunteerCategories;