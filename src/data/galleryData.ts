// src/data/galleryData.ts

export type GalleryImage = {
  id: number;
  keyword: string; // Used to fetch images from an external source like Unsplash
  alt: string;
};

export const galleryImages: GalleryImage[] = [
  { id: 1, keyword: 'library interior', alt: 'A modern, well-lit library interior.' },
  { id: 2, keyword: 'bookshelves wooden', alt: 'Tall, wooden bookshelves filled with books.' },
  { id: 3, keyword: 'students reading', alt: 'Students studying quietly at a long table.' },
  { id: 4, keyword: 'library computer lab', alt: 'A view of the library computer lab.' },
  { id: 5, keyword: 'old books close-up', alt: 'A close-up of several antique books.' },
  { id: 6, keyword: 'quiet study area', alt: 'An empty, quiet study area with natural light.' },
  { id: 7, keyword: 'children section library', alt: 'A colorful section of the library for children.' },
  { id: 8, keyword: 'library entrance sign', alt: 'The main entrance sign of the library.' },
  { id: 9, keyword: 'book stacking minimal', alt: 'A minimal, artistic arrangement of books.' },
  { id: 10, keyword: 'librarian desk', alt: 'A friendly librarian sitting at the help desk.' },
  { id: 11, keyword: 'historical archive', alt: 'A shelf containing historical archive documents.' },
];