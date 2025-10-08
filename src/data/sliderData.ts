// src/data/sliderData.ts

export type Slide = {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  interval?: number; // Optional custom interval in milliseconds
};

export const slides: Slide[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1616070152767-3eb99cf10509?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
    title: "Enrich Your Knowledge",
    description: "Discover thousands of books across all genres and subjects.",
    interval: 3000,
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
    title: "Quiet Reading Spaces",
    description: "Find your perfect corner for concentration and peace.",
    interval: 5000,
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1608454367599-c133fcab1245?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
    title: "Digital Resources Available",
    description: "Access our vast collection of e-books and online journals.",
  },
];