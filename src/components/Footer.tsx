// import React is not needed in modern React/Next.js
import Link from 'next/link';
import { X, Linkedin, Send, Instagram, Mail, Phone } from 'lucide-react';

// --- Component ---

export const Footer = () => {
    // Define a base class for social icons for reuse
    const socialIconClass = 'h-5 w-5 text-white';

    return (
        <footer className="bg-gray-900 text-white pt-12 pb-6 mt-16 border-t border-red-600">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-2 gap-8 pb-10 md:grid-cols-4 lg:grid-cols-4">
                    
                    {/* Contact Details */}
                    <div className="col-span-1">
                        <h3 className="mb-4 text-lg font-bold text-red-400">Contact Us</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p>Librarian, Government School</p>
                            <p>Visakhapatnam-530041</p>
                            <p>Andhra Pradesh, India</p>
                            <a href="mailto:example@gmail.com" className="flex items-center hover:text-red-400 transition-colors">
                                <Mail className="h-4 w-4 mr-2" />
                                example@gmail.com
                            </a>
                            <a href="tel:+919123456787" className="flex items-center hover:text-red-400 transition-colors">
                                <Phone className="h-4 w-4 mr-2" />
                                +91 9123456787
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="mb-4 text-lg font-bold text-red-400">Quick Links</h3>
                        <nav className="flex flex-col space-y-2 text-sm">
                            <Link href="/" className="text-gray-300 hover:text-red-400 transition-colors">Home</Link>
                            <Link href="/books" className="text-gray-300 hover:text-red-400 transition-colors">Book Catalog</Link>
                            <Link href="/about" className="text-gray-300 hover:text-red-400 transition-colors">About Us</Link>
                            <Link href="/contact" className="text-gray-300 hover:text-red-400 transition-colors">Support</Link>
                        </nav>
                    </div>

                    {/* Librarian Details */}
                    <div className="col-span-2">
                        <h3 className="mb-4 text-lg font-bold text-red-400">Librarian</h3>
                        <div className="space-y-1 text-sm text-gray-300">
                            <p><span className="font-semibold">Name:</span> Dr. Name Surname</p>
                            <p><span className="font-semibold">Education:</span> M.L.I.Sc (Library Science)</p>
                            <p className="mt-4 text-gray-400">
                                Dedicated to promoting literacy and serving the academic needs of our community.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- */}

                {/* Social Media and Copyright */}
                <div className="mt-8 flex flex-col items-center justify-between space-y-4 border-t border-gray-800 pt-6 md:flex-row md:space-y-0">
                    
                    {/* Social Icons */}
                    <div className="flex space-x-3">
                        <a href='#' aria-label="Twitter" className='p-2 rounded-full bg-red-600 hover:bg-red-700 transition-transform duration-300 hover:scale-110'>
                            <X className={socialIconClass} />
                        </a>
                        <a href='#' aria-label="LinkedIn" className='p-2 rounded-full bg-red-600 hover:bg-red-700 transition-transform duration-300 hover:scale-110'>
                            <Linkedin className={socialIconClass} />
                        </a>
                        <a href='#' aria-label="Telegram" className='p-2 rounded-full bg-red-600 hover:bg-red-700 transition-transform duration-300 hover:scale-110'>
                            <Send className={socialIconClass} />
                        </a>
                        <a href='#' aria-label="Instagram" className='p-2 rounded-full bg-red-600 hover:bg-red-700 transition-transform duration-300 hover:scale-110'>
                            <Instagram className={socialIconClass} />
                        </a>
                    </div>
                    
                    {/* Copyright */}
                    <p className='text-center text-sm text-gray-400'>
                        &copy; {new Date().getFullYear()} All rights reserved. 
                        <span className="ml-2 border-l border-gray-700 pl-2">
                            Designed with ❤️ by <span className="text-red-400 font-semibold">Shrey Vats</span>
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
};