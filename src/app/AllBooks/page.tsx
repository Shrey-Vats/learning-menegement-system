// AllBooks.tsx
"use client"
import React, { useState } from "react";
import BookCard, { Book } from "@/components/Book" // Import the component and the Book interface

// --- Mock Data (Replace with an actual API call later) ---
const initialBooks: Book[] = [
    {
        id: 1,
        title: "Wings Of Fire",
        author: "Pranavdhar",
        category: "Auto Biography",
        coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp16xiXu1ZtTzbLy-eSwEK4Ng6cUpUZnuGbQ&usqp=CAU",
    },
    {
        id: 2,
        title: "The Power Of Your Subconscious Mind",
        author: "Joseph Murphy",
        category: "Psychology",
        coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Rb2t6jA5ml7n57qdTZbAOWX1qSfsLCbaOA&usqp=CAU",
    },
    {
        id: 3,
        title: "Elon Musk",
        author: "Walter Isaacson",
        category: "Biography",
        coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRFiDRQ7a-Oo-CnMmnbIMApP1Cq9B5bYx-UA&usqp=CAU",
    },
    {
        id: 4,
        title: "The Subtle Art Of Not Giving A Fuck",
        author: "Mark Manson",
        category: "Self-Help",
        coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Rb2t6jA5ml7n57qdTZbAOWX1qSfsLCbaOA&usqp=CAU",
    },
    // Add a fifth book for better grid demonstration
    {
        id: 5,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Productivity",
        coverUrl: "https://m.media-amazon.com/images/I/51-uspgjAUL._SY445_SX342_.jpg",
    },
];

const AllBooks: React.FC = () => {
    // Use state to hold the list of books (ready for a future API call)
    const [books] = useState<Book[]>(initialBooks);

    const handleBookClick = (book: Book) => {
        // Example: Navigate to a detailed view or show a modal
        console.log(`Clicked on book: ${book.title}`);
        // In a real app, you might use: navigate(`/books/${book.id}`);
    };

    return (
        // Main container with padding and background
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            
            {/* --- Clear Section / Header --- */}
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                    Our Library Collection
                </h1>
                <p className="text-xl text-gray-600">
                    Explore all available books and find your next read.
                </p>
                
                {/* Placeholder for search/filter UI */}
                <div className="mt-6 flex justify-center">
                    <input 
                        type="text"
                        placeholder="Search books by title, author, or category..."
                        className="w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </header>

            {/* --- Books Grid --- */}
            <div className="max-w-7xl mx-auto">
                {/* Tailwind Grid Classes: Responsive columns */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {/* Iterate over the books data and render a BookCard for each */}
                    {books.map((book) => (
                        <BookCard 
                            key={book.id} 
                            book={book} 
                            onClick={handleBookClick} 
                        />
                    ))}
                </div>

                {/* Optional: Message if no books are found */}
                {books.length === 0 && (
                    <div className="text-center p-10 text-gray-500">
                        No books found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllBooks;