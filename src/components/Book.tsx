import React from 'react';

export interface Book {
    id: number | string;
    title: string;
    author: string;
    category: string;
    coverUrl: string;
}

interface BookCardProps {
    book: Book;
    onClick?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
    return (
        <div
            className={`
                bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-[1.03] 
                transition duration-300 ease-in-out cursor-pointer group 
                ${onClick ? 'hover:shadow-2xl' : ''}
            `}
            onClick={() => onClick && onClick(book)}
        >
            <div className="relative">
                {/* Book Cover Image */}
                <img
                    src={book.coverUrl}
                    alt={`${book.title} cover`}
                    // Tailwind classes for the image: aspect ratio, full width, object cover
                    className="w-full h-72 object-cover" 
                />
                
                {/* Category Badge (Positioned at the bottom-left of the image) */}
                <div className="absolute bottom-0 left-0 m-2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full shadow-lg">
                    {book.category}
                </div>
            </div>

            {/* Book Details Section */}
            <div className="p-4 space-y-1">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                    {book.title}
                </h3>
                <p className="text-sm text-gray-500 italic">
                    By {book.author}
                </p>
            </div>
            
            {/* Action Area (This replaces your 'bookcard-emptybox') */}
            <div className="p-4 pt-0">
                 <button className="w-full py-2 bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-600 transition duration-150 ease-in-out">
                    View Details
                 </button>
            </div>
        </div>
    );
};

export default BookCard;