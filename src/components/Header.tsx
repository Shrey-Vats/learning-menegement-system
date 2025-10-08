import { useState } from 'react';
// In a Next.js project, this would typically be: import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import Link from 'next/link';

// Define the type for the component's state
type HeaderState = {
  menutoggle: boolean;
};

// --- Component ---

export const Header = () => {
  const [menutoggle, setMenutoggle] = useState<HeaderState['menutoggle']>(false);

  const toggleMenu = () => {
    setMenutoggle(prev => !prev);
  };

  const closeMenu = () => {
    setMenutoggle(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Site Title */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="text-2xl font-extrabold text-gray-900 transition-colors hover:text-red-600" 
            onClick={closeMenu}
          >
            LIBRARY
          </Link>
        </div>

        {/* Navigation and Search - Desktop/Tablet */}
        <div className="hidden items-center md:flex md:space-x-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-64 rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              placeholder="Search a Book..."
            />
          </div>
          
          {/* Nav Options */}
          <nav className="flex space-x-6 font-medium">
            <Link 
              href="/" 
              className="text-gray-600 transition-colors hover:text-red-600 hover:scale-[1.02]"
            >
              Home
            </Link>
            <Link 
              href="/books" 
              className="text-gray-600 transition-colors hover:text-red-600 hover:scale-[1.02]"
            >
              Books
            </Link>
            {/* Shadcn Button Style for Sign In */}
            <Link 
              href="/signin" 
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50"
            >
              Sign In
            </Link>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          onClick={toggleMenu}
          aria-label={menutoggle ? 'Close menu' : 'Open menu'}
        >
          {menutoggle ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menutoggle ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-white border-t border-gray-100 shadow-lg`}
      >
        <div className="p-4 space-y-3">
            {/* Mobile Search Input */}
            <div className="relative block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    type="text"
                    placeholder="Search a Book..."
                />
            </div>

            {/* Mobile Nav Links */}
            <Link 
              href="/" 
              className="block w-full p-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium" 
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              href="/books" 
              className="block w-full p-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium" 
              onClick={closeMenu}
            >
              Books
            </Link>
            {/* Mobile Sign In Button */}
            <Link 
              href="/signin" 
              className="block w-full text-center rounded-lg bg-red-600 p-2 text-white transition-colors hover:bg-red-700 font-medium mt-2" 
              onClick={closeMenu}
            >
              Sign In
            </Link>
        </div>
      </div>
    </header>
  );
};