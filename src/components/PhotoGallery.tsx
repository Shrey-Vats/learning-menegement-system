"use client"
import { ArrowRight } from 'lucide-react';
import { galleryImages, GalleryImage } from '@/data/galleryData'; // Assuming galleryData is in src/data
import { useState } from 'react';
// Shadcn/Tailwind convention often uses a maximum number of items initially
const INITIAL_IMAGE_COUNT = 8; 

export const PhotoGallery = () => {
  // Simple state to control how many images are shown
  const [visibleCount, setVisibleCount] = useState(INITIAL_IMAGE_COUNT);
  const totalImages = galleryImages.length;
  const hasMore = visibleCount < totalImages;

  const loadMore = () => {
    // Increase count, perhaps by 4 or to the total number
    setVisibleCount(totalImages); 
  };

  const imagesToShow = galleryImages.slice(0, visibleCount);

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12'>
        
        {/* Title (Shadcn style with border) */}
        <h2 className='text-3xl font-bold tracking-tight text-gray-900 border-b-2 border-red-600 pb-2 mb-8'>
            Photo Gallery
        </h2>

        {/* Dynamic Image Grid (using CSS Grid with Tailwind) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagesToShow.map((image: GalleryImage, index: number) => (
                <div 
                    key={image.id} 
                    className="relative overflow-hidden rounded-lg shadow-md aspect-square group transition-transform duration-300 hover:scale-[1.02]"
                >
                    {/* The Unsplash URL is dynamically generated using the keyword */}
                    <img 
                        src={`https://source.unsplash.com/400x400/?${image.keyword}`} 
                        alt={image.alt}
                        // Object-cover ensures images fill the container nicely
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                        // Tailwind classes to create a hover overlay effect (optional)
                    />
                    
                    {/* Optional Image Caption Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <p className="text-white text-sm font-medium">{image.alt}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* View More Button (Shadcn Button style) */}
        {hasMore && (
            <div className="flex justify-center mt-10">
                <button
                    onClick={loadMore}
                    className="inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-base font-medium text-white shadow transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50"
                >
                    VIEW ALL IMAGES
                    <ArrowRight className="ml-2 h-5 w-5" />
                </button>
            </div>
        )}
    </div>
  );
};