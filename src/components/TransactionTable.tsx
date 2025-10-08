// TransactionTable.tsx (using shadcn/ui)
import React from 'react';
import { Transaction } from '@/types/member';
import moment from 'moment';

// Import shadcn/ui components
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface TransactionTableProps {
    title: string;
    transactions: Transaction[] | undefined;
    type: 'Issued' | 'Reserved' | 'History';
}

// Function to calculate fine (retained from previous version)
const calculateFine = (toDate: string): number => {
    // ... (Fine calculation logic remains the same)
    const dueDate = Date.parse(toDate);
    const today = Date.parse(moment(new Date()).format("MM/DD/YYYY"));
    const dayInMs = 86400000;
    
    const diffInDays = Math.floor((today - dueDate) / dayInMs);
    return diffInDays > 0 ? diffInDays * 10 : 0;
};

const TransactionTable: React.FC<TransactionTableProps> = ({ title, transactions, type }) => {
    
    const data = type === 'History' 
        ? transactions 
        : transactions?.filter(t => t.transactionType === type);

    if (!data || data.length === 0) {
        return (
            <Card className="p-8 text-center bg-white mt-4">
                <p className="text-lg text-muted-foreground">No {title.toLowerCase()} books found.</p>
            </Card>
        );
    }

    return (
        <Card className="mt-4 overflow-x-auto">
            <Table>
                <TableCaption>A list of your {title.toLowerCase()}.</TableCaption>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[50px]">S.No</TableHead>
                        <TableHead>Book Name</TableHead>
                        <TableHead>From Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        {type === 'Issued' && <TableHead>Fine (₹)</TableHead>}
                        {type === 'History' && <TableHead>Returned On</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((transaction, index) => (
                        <TableRow key={index} className="hover:bg-primary/5">
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className="font-semibold text-primary">{transaction.bookName}</TableCell>
                            <TableCell>{moment(transaction.fromDate).format('MMM Do, YYYY')}</TableCell>
                            <TableCell>{moment(transaction.toDate).format('MMM Do, YYYY')}</TableCell>
                            
                            {type === 'Issued' && (
                                <TableCell>
                                    <Badge 
                                        variant={calculateFine(transaction.toDate) > 0 ? 'destructive' : 'secondary'}
                                        className='font-bold'
                                    >
                                        ₹{calculateFine(transaction.toDate)}
                                    </Badge>
                                </TableCell>
                            )}
                            {type === 'History' && (
                                <TableCell>
                                    {transaction.returnDate ? moment(transaction.returnDate).format('MMM Do, YYYY') : 'N/A'}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

export default TransactionTable;