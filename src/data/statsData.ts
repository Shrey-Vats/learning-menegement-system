// src/data/statsData.ts
import { LibraryBig, Users, BookMarked, Icon } from 'lucide-react';

export type Stat = {
  id: number;
  title: string;
  count: number;
  icon: typeof Icon; // Type for lucide-react icons
  color: string; // Tailwind color class
};

export const stats: Stat[] = [
  {
    id: 1,
    title: 'Total Books',
    count: 3254,
    icon: LibraryBig,
    color: 'text-red-600 bg-red-50',
  },
  {
    id: 2,
    title: 'Total Members',
    count: 254,
    icon: Users,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    id: 3,
    title: 'Reservations',
    count: 54,
    icon: BookMarked,
    color: 'text-green-600 bg-green-50',
  },
  // Optionally add another stat for a 4-column layout
  {
    id: 4,
    title: 'Books Issued',
    count: 121,
    icon: BookMarked,
    color: 'text-yellow-600 bg-yellow-50',
  },
];