import { Opportunity } from '../types/opportunity';

export const featuredOpportunities: Opportunity[] = [
  {
    id: '1',
    title: "Community Food Drive",
    organization: "Local Food Bank",
    location: "Downtown Community Center",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Food & Hunger",
    volunteers: 25,
    description: "Help distribute food to families in need in our community."
  },
  {
    id: '2',
    title: "Beach Cleanup Initiative",
    organization: "Ocean Guardians",
    location: "Sunset Beach",
    date: "March 20, 2024",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Environment",
    volunteers: 50,
    description: "Join us in keeping our beaches clean and safe for wildlife."
  },
  {
    id: '3',
    title: "Children's Reading Program",
    organization: "City Library",
    location: "Public Library Main Branch",
    date: "March 22, 2024",
    image: "https://images.unsplash.com/photo-1524779709304-40b5a3560c60?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Education",
    volunteers: 20,
    description: "Help young children develop their reading skills."
  }
];