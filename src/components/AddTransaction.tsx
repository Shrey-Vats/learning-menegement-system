// src/components/AdminDashboard/AddTransaction/AddTransaction.tsx

import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import axios from "axios";
import moment from "moment";
import { AuthContext } from '@/Context/AuthContext'; // Assume you'll update AuthContext.js to AuthContext.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // Assumes you have shadcn's utility function for class merging
import { IBook, IDropdownOption, IMember, ITransaction } from '@/types/adminDashboard';

// --- TypeScript Interfaces ---
interface IAuthContext {
    user: {
        id: string;
        name: string;
        email: string;
        isAdmin: boolean;
        // Add other user properties as needed
    } | null;
}

// --- Utility Function for Fine Calculation ---
const calculateFine = (toDateString: string): number => {
    const today = moment().startOf('day');
    const dueDate = moment(toDateString, "MM/DD/YYYY").startOf('day');
    const daysOverdue = today.diff(dueDate, 'days');
    return daysOverdue > 0 ? daysOverdue * 10 : 0;
};
// ---------------------------------------------

const DATE_FORMAT = "MM/DD/YYYY";
const API_URL = process.env.REACT_APP_API_URL;

function AddTransaction() {
    const { user } = useContext(AuthContext) as IAuthContext;

    const [isLoading, setIsLoading] = useState(false);
    const [borrowerId, setBorrowerId] = useState<string>("");
    const [borrowerDetails, setBorrowerDetails] = useState<IMember | null>(null);
    const [bookId, setBookId] = useState<string>("");
    const [bookDetails, setBookDetails] = useState<IBook | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<ITransaction[]>([]);
    const [allMembers, setAllMembers] = useState<IDropdownOption[]>([]);
    const [allBooks, setAllBooks] = useState<IDropdownOption[]>([]);
    const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
    const [toDate, setToDate] = useState<Date | undefined>(undefined);
    const [transactionType, setTransactionType] = useState<"Reserved" | "Issued" | "">("");

    const transactionTypes: IDropdownOption[] = useMemo(() => ([
        { value: 'Reserved', text: 'Reserve' },
        { value: 'Issued', text: 'Issue' }
    ]), []);

    // Helper state for formatted date strings (less redundant with moment format)
    const fromDateString = useMemo(() => fromDate ? moment(fromDate).format(DATE_FORMAT) : null, [fromDate]);
    const toDateString = useMemo(() => toDate ? moment(toDate).format(DATE_FORMAT) : null, [toDate]);

    // Fetch Members
    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(`${API_URL}api/users/allmembers`);
                const options: IDropdownOption[] = response.data.map((member: IMember) => ({
                    value: member.id,
                    text: `${member.userFullName}[${member.userType === "Student" ? member.admissionId : member.employeeId}]`
                }));
                setAllMembers(options);
            } catch (err) {
                console.error("Error fetching members:", err);
            }
        };
        getMembers();
    }, [API_URL]);

    // Fetch Books
    useEffect(() => {
        const getallBooks = async () => {
            try {
                const response = await axios.get(`${API_URL}api/books/allbooks`);
                const options: IDropdownOption[] = response.data.map((book: IBook) => ({
                    value: book.id,
                    text: book.bookName
                }));
                setAllBooks(options);
            } catch (err) {
                console.error("Error fetching books:", err);
            }
        };
        getallBooks();
    }, [API_URL]);

    // Fetch Borrower Details based on selection
    useEffect(() => {
        const getBorrowerDetails = async () => {
            if (!borrowerId) {
                setBorrowerDetails(null);
                return;
            }
            try {
                const response = await axios.get<IMember>(`${API_URL}api/users/getuser/${borrowerId}`);
                setBorrowerDetails(response.data);
            } catch (err) {
                console.error("Error fetching borrower details:", err);
                setBorrowerDetails(null);
            }
        };
        getBorrowerDetails();
    }, [API_URL, borrowerId]);

    // Fetch Book Details based on selection
    useEffect(() => {
        const getBookDetails = async () => {
            if (!bookId) {
                setBookDetails(null);
                return;
            }
            try {
                const response = await axios.get<IBook>(`${API_URL}api/books/getbook/${bookId}`);
                setBookDetails(response.data);
            } catch (err) {
                console.error("Error fetching book details:", err);
                setBookDetails(null);
            }
        };
        getBookDetails();
    }, [API_URL, bookId]);


    // Fetch Recent Transactions
    useEffect(() => {
        const getTransactions = async () => {
            try {
                const response = await axios.get<ITransaction[]>(`${API_URL}api/transactions/all-transactions`);
                setRecentTransactions(response.data.slice(0, 5));
            } catch (err) {
                console.error("Error in fetching transactions", err);
            }
        };
        getTransactions();
    }, [API_URL]);

    /* Adding a Transaction */
    const addTransaction = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!bookId || !borrowerId || !transactionType || !fromDateString || !toDateString) {
            alert("Fields must not be empty");
            setIsLoading(false);
            return;
        }

        try {
            const book_details_check = await axios.get<IBook>(`${API_URL}api/books/getbook/${bookId}`);
            const bookCountAvailable = book_details_check.data.bookCountAvailable;

            const isAvailableForIssue = bookCountAvailable > 0 && transactionType === "Issued";
            const isAvailableForReserve = (bookCountAvailable > 0 || bookCountAvailable === 0) && transactionType === "Reserved";

            if (isAvailableForIssue || isAvailableForReserve) {
                const borrower_details_data = borrowerDetails || await axios.get<IMember>(`${API_URL}api/users/getuser/${borrowerId}`).then(res => res.data);
                const book_details_data = bookDetails || await axios.get<IBook>(`${API_URL}api/books/getbook/${bookId}`).then(res => res.data);

                const transactionData = {
                    bookId,
                    borrowerId,
                    borrowerName: borrower_details_data!.userFullName,
                    bookName: book_details_data!.bookName,
                    transactionType,
                    fromDate: fromDateString,
                    toDate: toDateString,
                    isAdmin: user!.isAdmin
                };

                const response = await axios.post<ITransaction>(`${API_URL}api/transactions/add-transaction`, transactionData);
                const newTransaction = response.data;

                // Update user active transactions
                await axios.put(`${API_URL}api/users/${newTransaction.id}/move-to-activetransactions`, {
                    userId: borrowerId,
                    isAdmin: user!.isAdmin
                });

                // Decrement book count
                await axios.put(`${API_URL}api/books/updatebook/${bookId}`, {
                    isAdmin: user!.isAdmin,
                    bookCountAvailable: bookCountAvailable - 1
                });

                // Update recent transactions list
                setRecentTransactions(prev => [newTransaction, ...prev].slice(0, 5));

                // Reset form
                setBorrowerId("");
                setBookId("");
                setTransactionType("");
                setFromDate(undefined);
                setToDate(undefined);
                setBorrowerDetails(null);
                setBookDetails(null);

                alert("Transaction was successful 🎉");
            } else {
                alert("The book is not available for issue.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred during the transaction.");
        } finally {
            setIsLoading(false);
        }
    }, [bookId, borrowerId, transactionType, fromDateString, toDateString, user!.isAdmin, borrowerDetails, bookDetails]);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Add a Transaction</h2>
            <div className="h-px bg-gray-200 w-full" />

            <form className='space-y-6' onSubmit={addTransaction}>
                {/* Borrower Select */}
                <div className="space-y-2">
                    <label htmlFor="borrowerId" className="text-sm font-medium">Borrower <span className="text-red-500">*</span></label>
                    <Select value={borrowerId} onValueChange={setBorrowerId} disabled={isLoading}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Member" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {allMembers.map((member) => (
                                <SelectItem key={member.value} value={member.value}>{member.text}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Borrower Details Table */}
                {borrowerDetails && (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Issued</TableHead>
                                    <TableHead>Reserved</TableHead>
                                    <TableHead>Points</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">{borrowerDetails.userFullName}</TableCell>
                                    <TableCell>{borrowerDetails.activeTransactions?.filter(data => data.transactionType === "Issued" && data.transactionStatus === "Active").length || 0}</TableCell>
                                    <TableCell>{borrowerDetails.activeTransactions?.filter(data => data.transactionType === "Reserved" && data.transactionStatus === "Active").length || 0}</TableCell>
                                    <TableCell>{borrowerDetails.points}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <h4 className="text-lg font-semibold px-4 pt-4 pb-2">Active Transactions</h4>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead>Book-Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Fine</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {borrowerDetails.activeTransactions
                                    ?.filter(data => data.transactionStatus === "Active")
                                    .map((data, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{data.bookName}</TableCell>
                                            <TableCell>{data.transactionType}</TableCell>
                                            <TableCell>{data.toDate}</TableCell>
                                            <TableCell className={calculateFine(data.toDate) > 0 ? "text-red-600 font-bold" : ""}>
                                                &#8377;{calculateFine(data.toDate)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Book Select */}
                <div className="space-y-2">
                    <label htmlFor="bookName" className="text-sm font-medium">Book Name <span className="text-red-500">*</span></label>
                    <Select value={bookId} onValueChange={setBookId} disabled={isLoading}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Book" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {allBooks.map((book) => (
                                <SelectItem key={book.value} value={book.value}>{book.text}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Book Details Table (Conceptual, assuming you fetch this data) */}
                {bookDetails && (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead>Available Copies</TableHead>
                                    {/* Assuming reserved count is also a book property or derived from transactions */}
                                    <TableHead>Reserved (Total)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{bookDetails.bookCountAvailable}</TableCell>
                                    <TableCell>{/* Placeholder for Reserved Count */}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Transaction Type Select */}
                <div className="space-y-2">
                    <label htmlFor="transactionType" className="text-sm font-medium">Transaction Type <span className="text-red-500">*</span></label>
                    <Select value={transactionType} onValueChange={(value: "Reserved" | "Issued") => setTransactionType(value)} disabled={isLoading}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Transaction" />
                        </SelectTrigger>
                        <SelectContent>
                            {transactionTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>{type.text}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Date Pickers */}
                <div className="flex space-x-4">
                    <div className="space-y-2 flex-1">
                        <label htmlFor="from-date" className="text-sm font-medium">From Date <span className="text-red-500">*</span></label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !fromDate && "text-muted-foreground"
                                    )}
                                    disabled={isLoading}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {fromDate ? moment(fromDate).format(DATE_FORMAT) : <span>MM/DD/YYYY</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={fromDate}
                                    onSelect={setFromDate}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2 flex-1">
                        <label htmlFor="to-date" className="text-sm font-medium">To Date <span className="text-red-500">*</span></label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !toDate && "text-muted-foreground"
                                    )}
                                    disabled={isLoading || !fromDate}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {toDate ? moment(toDate).format(DATE_FORMAT) : <span>MM/DD/YYYY</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={toDate}
                                    onSelect={setToDate}
                                    initialFocus
                                    disabled={(date) => date <= (fromDate || new Date())}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'SUBMIT'}
                </Button>
            </form>

            {/* Recent Transactions Table */}
            <h2 className="text-2xl font-bold tracking-tight pt-4">Recent Transactions</h2>
            <div className="h-px bg-gray-200 w-full" />
            <div className="border rounded-lg overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead className="w-[50px]">S.No</TableHead>
                            <TableHead>Book Name</TableHead>
                            <TableHead>Borrower Name</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentTransactions.map((transaction, index) => (
                            <TableRow key={transaction.id || index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{transaction.bookName}</TableCell>
                                <TableCell>{transaction.borrowerName}</TableCell>
                                <TableCell>{transaction.updatedAt.slice(0, 10)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default AddTransaction;