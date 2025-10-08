// Components/AddBook.tsx
import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
// Assuming AuthContext is correctly defined elsewhere
import { AuthContext } from '@/Context/AuthContext'; 

// Import shadcn/ui components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// --- Multi-Select Imports (You need to implement this component or use a library built with shadcn/ui) ---
// For a simple implementation, we'll use a standard Select/DropdownMenu and simulate multi-select state.
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface CategoryOption {
    value: string; // The _id
    text: string;  // The categoryName
}

interface RecentBook {
    _id: string;
    bookName: string;
    createdAt: string;
}

function AddBook() {
    const API_URL = process.env.REACT_APP_API_URL;
    const [isLoading, setIsLoading] = useState(false);
    // Assuming user context is typed
    const { user } = useContext(AuthContext) as any; 

    const [bookName, setBookName] = useState("");
    const [alternateTitle, setAlternateTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [bookCountAvailable, setBookCountAvailable] = useState<number | ''>('');
    const [language, setLanguage] = useState("");
    const [publisher, setPublisher] = useState("");
    const [allCategories, setAllCategories] = useState<CategoryOption[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Array of category _ids
    const [recentAddedBooks, setRecentAddedBooks] = useState<RecentBook[]>([]);

    /* Fetch all the Categories */
    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get(API_URL + "api/categories/allcategories");
                const all_categories: CategoryOption[] = response.data.map((category: any) => ({
                    value: category._id,
                    text: category.categoryName
                }));
                setAllCategories(all_categories);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        getAllCategories();
    }, [API_URL]);

    /* Adding book function */
    const addBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Basic validation
        if (!bookName || !author || !bookCountAvailable || selectedCategories.length === 0) {
            alert("Please fill all required fields.");
            setIsLoading(false);
            return;
        }

        const BookData = {
            bookName,
            alternateTitle,
            author,
            bookCountAvailable: Number(bookCountAvailable),
            language,
            publisher,
            categories: selectedCategories,
            isAdmin: user?.isAdmin || true // Assuming admin status
        };
        
        try {
            const response = await axios.post(API_URL + "api/books/addbook", BookData);
            
            // Update recent books (keeping only the top 5)
            setRecentAddedBooks(prev => [response.data, ...prev.slice(0, 4)]);
            
            // Clear form
            setBookName("");
            setAlternateTitle("");
            setAuthor("");
            setBookCountAvailable('');
            setLanguage("");
            setPublisher("");
            setSelectedCategories([]);
            alert("Book Added Successfully 🎉");
        } catch (err) {
            console.error("Error adding book:", err);
            alert("Failed to add book.");
        }
        setIsLoading(false);
    };

    // Toggle category selection
    const toggleCategory = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    /* Fetch initial recent books */
    useEffect(() => {
        const getallBooks = async () => {
            try {
                const response = await axios.get(API_URL + "api/books/allbooks");
                setRecentAddedBooks(response.data.slice(0, 5));
            } catch (err) {
                console.error("Error fetching recent books:", err);
            }
        };
        getallBooks();
    }, [API_URL]);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 shadow-none border-none">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Add New Book</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className='space-y-4' onSubmit={addBook}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="bookName">Book Name <span className="text-red-500">*</span></Label>
                                <Input id="bookName" type="text" value={bookName} onChange={(e) => setBookName(e.target.value)} required />
                            </div>

                            <div>
                                <Label htmlFor="alternateTitle">Alternate Title</Label>
                                <Input id="alternateTitle" type="text" value={alternateTitle} onChange={(e) => setAlternateTitle(e.target.value)} />
                            </div>

                            <div>
                                <Label htmlFor="author">Author Name <span className="text-red-500">*</span></Label>
                                <Input id="author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                            </div>

                            <div>
                                <Label htmlFor="language">Language</Label>
                                <Input id="language" type="text" value={language} onChange={(e) => setLanguage(e.target.value)} />
                            </div>

                            <div>
                                <Label htmlFor="publisher">Publisher</Label>
                                <Input id="publisher" type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
                            </div>

                            <div>
                                <Label htmlFor="copies">No. of Copies Available <span className="text-red-500">*</span></Label>
                                <Input id="copies" type="number" value={bookCountAvailable} onChange={(e) => setBookCountAvailable(e.target.value === '' ? '' : Number(e.target.value))} required />
                            </div>
                        </div>

                        {/* Categories Dropdown */}
                        <div className="space-y-2">
                            <Label htmlFor="categories">Categories <span className="text-red-500">*</span></Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {selectedCategories.length > 0
                                            ? `${selectedCategories.length} selected`
                                            : "Select Categories"}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-72">
                                    {allCategories.map((category) => (
                                        <DropdownMenuCheckboxItem
                                            key={category.value}
                                            checked={selectedCategories.includes(category.value)}
                                            onCheckedChange={() => toggleCategory(category.value)}
                                        >
                                            {category.text}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {selectedCategories.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {selectedCategories.map(id => {
                                        const category = allCategories.find(c => c.value === id);
                                        return category ? <Badge key={id} variant="secondary">{category.text}</Badge> : null;
                                    })}
                                </div>
                            )}
                        </div>

                        <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Add Book"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Recently Added Books */}
            <Card className="lg:col-span-1 shadow-none border-none">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Recently Added</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">S.No</TableHead>
                                <TableHead>Book Name</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentAddedBooks.map((book, index) => (
                                <TableRow key={book._id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{book.bookName}</TableCell>
                                    <TableCell className="text-right">{book.createdAt.substring(0, 10)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableCaption>{recentAddedBooks.length === 0 ? "No recent books added." : "Top 5 recently added books."}</TableCaption>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default AddBook;