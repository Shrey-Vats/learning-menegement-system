import { ArrowRight } from 'lucide-react';
import { books, Book } from '@/data/bookData'; 

export const PopularBooks = () => {
  // Filter for popular books
  const popularBooks = books.filter(book => book.isPopular);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title */}
      <h2 className='text-3xl font-bold tracking-tight text-gray-900 border-b-2 border-red-600 pb-2 mb-8'>
        Popular Books 🔥
      </h2>

      {/* Book Carousel/Scroller */}
      <div 
        className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide"
        // Tailwind classes for a smooth scrolling experience
      >
        {popularBooks.map((book: Book) => (
          <div 
            key={book.id} 
            className="flex-shrink-0 w-32 sm:w-40 bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
          >
            {/* Book Cover */}
            <div className="aspect-[3/4] overflow-hidden">
                <img 
                    src={book.coverUrl} 
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                />
            </div>
            
            {/* Book Info */}
            <div className="p-3 text-center">
              <p className="text-sm font-semibold text-gray-900 truncate" title={book.title}>{book.title}</p>
              <p className="text-xs text-gray-500 truncate">{book.author}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-8">
        <button
            className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
            View All Popular
            <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};