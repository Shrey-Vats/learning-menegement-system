// src/app/page.tsx (or src/pages/Home.tsx if using Pages Router)

import React from 'react';
// Assuming these components have been updated with Tailwind/Shadcn styling
// and are located in the '@/components' alias.
import { Footer } from '@/components/Footer';
import { ImageSlider } from '@/components/ImageSlider';
import { PhotoGallery } from '@/components/PhotoGallery';
import { PopularBooks } from '@/components/PopularBooks';
import { RecentAddedBooks } from '@/components/RecentAddedBooks';
import { ReservedBooks } from '@/components/ReservedBooks';
import { Stats } from '@/components/Stats';

function Home() {
    return (
        // Use a wrapping div to set the overall background and minimum height
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900" id="home">
            
            {/* 1. Image Slider */}
            {/* Typically takes full width and height is managed internally */}
            <ImageSlider />
            
            {/* Main Content Area */}
            <main className="mx-auto max-w-screen-2xl"> 
                
                {/* 2. Stats Section */}
                {/* Use py-16 for top/bottom padding */}
                <section id="stats" className="py-16">
                    <Stats />
                </section>
                
                <hr className="my-4 border-gray-200 dark:border-gray-700" />

                {/* 3. Recent Added Books */}
                <section id="recent-books" className="py-12">
                    <RecentAddedBooks />
                </section>

                <hr className="my-4 border-gray-200 dark:border-gray-700" />

                {/* 4. Popular Books */}
                <section id="popular-books" className="py-12">
                    <PopularBooks />
                </section>

                <hr className="my-4 border-gray-200 dark:border-gray-700" />
                
                {/* 5. Reserved Books / Books On Hold (Dashboard Element) */}
                <section id="reserved-books" className="py-12">
                    <ReservedBooks />
                </section>

                <hr className="my-4 border-gray-200 dark:border-gray-700" />

                {/* 6. Photo Gallery */}
                <section id="photo-gallery" className="py-16">
                    <PhotoGallery />
                </section>
                
            </main>

            {/* 7. Footer */}
            <Footer />
            
        </div>
    );
}

export default Home;