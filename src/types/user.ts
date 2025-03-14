export type UserRole = 'ngo' | 'volunteer';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string; // Only for NGOs
  phone: string;
  address?: string;
  createdAt: Date;
}