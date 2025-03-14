export interface Opportunity {
    id: string;
    title: string;
    organization: string;
    location: string;
    date: string;
    image: string;
    category: 'Food & Hunger' | 'Environment' | 'Education' | 'Healthcare' | 'Social Services';
    volunteers: number;
    description?: string;
  }