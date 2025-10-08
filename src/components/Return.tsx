// src/components/AdminDashboard/Return/Return.tsx

import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from "axios";
import moment from "moment";
import { AuthContext } from '@/Context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// --- TypeScript Interfaces ---
export interface IAuthContext {
    user: {
        id: string;
        name: string;
        email: string;
        isAdmin: boolean;
        // Add other user properties as needed
    } | null;
    // Add other AuthContext properties/methods if needed, e.g.:
    // login: (email: string, password: string) => Promise<void>;
    // logout: () => void;
}
interface ITransaction {
    _id: string;
    bookId: string;
    borrowerId: string;
    borrowerName: string;
    bookName: string;
    transactionType: 'Reserved' | 'Issued';
    transactionStatus: 'Active' | 'Completed';
    fromDate: string;
    toDate: string;
    updatedAt: string;
    returnDate?: string;
}

interface IMemberDetails {
    _id: string;
    userFullName: string;
    points: number;
}

interface IDropdownOption {
    value: string;
    text: string;
}

// --- Utility Function for Fine Calculation ---
const calculateFineDetails = (toDateString: string): { due: number, fine: number } => {
    const today = moment().startOf('day');
    const dueDate = moment(toDateString, "MM/DD/YYYY").startOf('day');
    const daysOverdue = today.diff(dueDate, 'days');
    const due = daysOverdue;
    const fine = daysOverdue > 0 ? daysOverdue * 10 : 0;
    return { due, fine };
};
// ---------------------------------------------

const API_URL = process.env.REACT_APP_API_URL;

function Return() {
    const { user } = useContext(AuthContext) as IAuthContext;

    const [allTransactions, setAllTransactions] = useState<ITransaction[]>([]);
    const [executionStatus, setExecutionStatus] = useState<string | null>(null);
    const [allMembersOptions, setAllMembersOptions] = useState<IDropdownOption[]>([]);
    const [borrowerId, setBorrowerId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    // Fetch Members
    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(`${API_URL}api/users/allmembers`);
                const options: IDropdownOption[] = response.data.map((member: IMemberDetails) => ({
                    value: member._id,
                    text: member.userFullName
                }));
                setAllMembersOptions([{ value: '', text: 'All Members' }, ...options]);
            } catch (err) {
                console.error("Error fetching members:", err);
                setError("Failed to fetch members list.");
            }
        };
        getMembers();
    }, [API_URL]);

    /* Getting all active transactions */
    useEffect(() => {
        const getAllTransactions = async () => {
            setError(null);
            try {
                const response = await axios.get<ITransaction[]>(`${API_URL}api/transactions/all-transactions`);
                const activeTransactions = response.data.filter(data => data.transactionStatus === "Active");
                setAllTransactions(activeTransactions.sort((a, b) => Date.parse(a.toDate) - Date.parse(b.toDate)));
            } catch (err) {
                console.error(err);
                setError("Failed to fetch active transactions.");
            } finally {
                setExecutionStatus(null);
            }
        };
        getAllTransactions();
    }, [API_URL, executionStatus]);

    const returnBook = useCallback(async (transaction: ITransaction) => {
        setError(null);
        const { due, fine } = calculateFineDetails(transaction.toDate);

        if (!window.confirm(`Are you sure you want to return "${transaction.bookName}"? Fine: ₹${fine}`)) {
            return;
        }

        try {
            // 1. Update Transaction status
            await axios.put(`${API_URL}api/transactions/update-transaction/${transaction._id}`, {
                isAdmin: user!.isAdmin,
                transactionStatus: "Completed",
                returnDate: moment().format("MM/DD/YYYY")
            });

            // 2. Update Borrower points
            const borrowerdata = await axios.get<IMemberDetails>(`${API_URL}api/users/getuser/${transaction.borrowerId}`);
            const currentPoints = borrowerdata.data.points;
            const newPoints = due > 0 ? currentPoints - 10 : currentPoints + 10;

            await axios.put(`${API_URL}api/users/updateuser/${transaction.borrowerId}`, {
                points: newPoints,
                isAdmin: user!.isAdmin
            });

            // 3. Increment book count
            const book_details = await axios.get(`${API_URL}api/books/getbook/${transaction.bookId}`);
            await axios.put(`${API_URL}api/books/updatebook/${transaction.bookId}`, {
                isAdmin: user!.isAdmin,
                bookCountAvailable: book_details.data.bookCountAvailable + 1
            });

            // 4. Move transaction to prevTransactions
            await axios.put(`${API_URL}api/users/${transaction._id}/move-to-prevtransactions`, {
                userId: transaction.borrowerId,
                isAdmin: user!.isAdmin
            });

            setExecutionStatus("Completed");
            alert("Book returned to the library successfully. Points updated.");
        } catch (err) {
            console.error(err);
            setError("Failed to process book return. Please check the network and permissions.");
        }
    }, [user!.isAdmin]);

    const convertToIssue = useCallback(async (transaction: ITransaction) => {
        setError(null);

        if (!window.confirm(`Are you sure you want to convert "${transaction.bookName}" (Reserved) to Issued?`)) {
            return;
        }

        try {
            // Update Transaction type to Issued
            await axios.put(`${API_URL}api/transactions/update-transaction/${transaction._id}`, {
                transactionType: "Issued",
                isAdmin: user!.isAdmin
            });

            setExecutionStatus("Issued");
            alert("Book issued successfully 🎆");
        } catch (err) {
            console.error(err);
            setError("Failed to convert reservation to issue.");
        }
    }, [user!.isAdmin]);

    const filteredIssuedTransactions = allTransactions.filter(data => {
        const isIssued = data.transactionType === "Issued";
        const isSelectedBorrower = borrowerId === "" || data.borrowerId === borrowerId;
        return isIssued && isSelectedBorrower;
    });

    const filteredReservedTransactions = allTransactions.filter(data => {
        const isReserved = data.transactionType === "Reserved";
        const isSelectedBorrower = borrowerId === "" || data.borrowerId === borrowerId;
        return isReserved && isSelectedBorrower;
    });

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Return & Manage Transactions</h2>
            <div className="h-px bg-gray-200 w-full" />

            {/* Member Filter */}
            <div className='max-w-lg'>
                <Select value={borrowerId} onValueChange={setBorrowerId}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by Member" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                        {allMembersOptions.map((member) => (
                            <SelectItem key={member.value} value={member.value}>{member.text}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {error && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Issued Books Table */}
            <h3 className="text-xl font-bold pt-4">Issued Books ({filteredIssuedTransactions.length})</h3>
            <div className="border rounded-lg overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead>Book Name</TableHead>
                            <TableHead>Borrower Name</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Fine (Today)</TableHead>
                            <TableHead className='text-right'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredIssuedTransactions.map((data) => {
                            const { fine } = calculateFineDetails(data.toDate);
                            return (
                                <TableRow key={data._id}>
                                    <TableCell className="font-medium">{data.bookName}</TableCell>
                                    <TableCell>{data.borrowerName}</TableCell>
                                    <TableCell>{data.toDate}</TableCell>
                                    <TableCell className={fine > 0 ? "text-red-600 font-bold" : ""}>
                                        &#8377;{fine}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <Button variant="default" size="sm" onClick={() => returnBook(data)}>Return</Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {filteredIssuedTransactions.length === 0 && (
                            <TableRow><TableCell colSpan={5} className="text-center py-4 text-gray-500">No active issued books found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Reserved Books Table */}
            <h3 className="text-xl font-bold pt-4">Reserved Books ({filteredReservedTransactions.length})</h3>
            <div className="border rounded-lg overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead>Book Name</TableHead>
                            <TableHead>Borrower Name</TableHead>
                            <TableHead>Reservation Until</TableHead>
                            <TableHead className='text-right'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReservedTransactions.map((data) => (
                            <TableRow key={data._id}>
                                <TableCell className="font-medium">{data.bookName}</TableCell>
                                <TableCell>{data.borrowerName}</TableCell>
                                <TableCell>{data.toDate}</TableCell>
                                <TableCell className='text-right'>
                                    <Button variant="outline" size="sm" onClick={() => convertToIssue(data)}>Convert to Issue</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredReservedTransactions.length === 0 && (
                            <TableRow><TableCell colSpan={4} className="text-center py-4 text-gray-500">No active reserved books found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default Return;