import { Opportunity } from '../types/opportunity';

export const featuredOpportunities: Opportunity[] = [
  {
    id: '1',
    title: "Community Food Drive",
    organization: "Local Food Bank",
    location: "Downtown Community Center",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=85",
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
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=85",
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
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=85",
    category: "Education",
    volunteers: 20,
    description: "Help young children develop their reading skills."
  }
];