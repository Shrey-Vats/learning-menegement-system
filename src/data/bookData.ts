// src/data/bookData.ts

export type Book = {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  isPopular: boolean;
  isRecent: boolean;
};

// Placeholder Data
export const books: Book[] = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear', coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/51-uspgjGgL._SY300_.jpg', isPopular: true, isRecent: false },
  { id: 2, title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71hrJtVv6QL._SY300_.jpg', isPopular: true, isRecent: false },
  { id: 3, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/81bsw6fnUiL._SY300_.jpg', isPopular: true, isRecent: true },
  { id: 4, title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey', coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/61OWq+LgQDL._SY300_.jpg', isPopular: true, isRecent: false },
  { id: 5, title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/713jI5J75vL._SY300_.jpg', isPopular: true, isRecent: true },
  { id: 6, title: 'Where the Crawdads Sing', author: 'Delia Owens', coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/81U2f7t5TJL._SY300_.jpg', isPopular: false, isRecent: true },
  { id: 7, title: 'Project Hail Mary', author: 'Andy Weir', coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/81+o23S9ECL._SY300_.jpg', isPopular: true, isRecent: true },
  { id: 8, title: 'A Promised Land', author: 'Barack Obama', coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/6182IeB5J1L._SY300_.jpg', isPopular: false, isRecent: true },
  // ... add more if needed
];