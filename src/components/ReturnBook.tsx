// src/components/ReturnBook.tsx
import React, { useState } from 'react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RotateCcw, AlertTriangle, DollarSign } from 'lucide-react';

const ReturnBook = () => {
  const { getActiveTransactions, returnBook, calculateFine, books } = useLibraryStore();
  
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [damageType, setDamageType] = useState<'None' | 'Small' | 'Large'>('None');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [calculatedFine, setCalculatedFine] = useState(0);

  const activeTransactions = getActiveTransactions();
  const transaction = activeTransactions.find((t) => t.id === selectedTransaction);

  // Calculate fine when transaction or damage changes
  React.useEffect(() => {
    if (transaction) {
      const fine = calculateFine(transaction, damageType);
      setCalculatedFine(fine);
    }
  }, [transaction, damageType, calculateFine]);

  const handleReturn = () => {
    if (!selectedTransaction) {
      setMessage({ type: 'error', text: 'Please select a transaction' });
      return;
    }

    const result = returnBook(selectedTransaction, damageType);
    
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });

    if (result.success) {
      setSelectedTransaction('');
      setDamageType('None');
    }
  };

  const getStatusBadge = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const daysRemaining = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      return <Badge variant="destructive">Overdue by {Math.abs(daysRemaining)} days</Badge>;
    } else if (daysRemaining <= 7) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Due in {daysRemaining} days</Badge>;
    }
    return <Badge variant="secondary">Active</Badge>;
  };

  const getDamageFineBreakdown = () => {
    if (!transaction) return null;

    const book = books.find((b) => b.id === transaction.bookId);
    if (!book) return null;

    const now = new Date();
    const dueDate = new Date(transaction.dueDate);
    const isOverdue = now > dueDate;
    
    let breakdown = [];

    if (isOverdue) {
      const daysLate = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      breakdown.push({
        label: 'Missing Book Fine (200% of price)',
        amount: book.price * 2,
      });
      breakdown.push({
        label: `Late Return Fine (₹50 × ${daysLate} days)`,
        amount: daysLate * 50,
      });
    }

    if (damageType === 'Small') {
      breakdown.push({
        label: 'Small Damage (10% of price)',
        amount: book.price * 0.1,
      });
    } else if (damageType === 'Large') {
      breakdown.push({
        label: 'Large Damage (50% of price)',
        amount: book.price * 0.5,
      });
    }

    return breakdown;
  };

  const fineBreakdown = getDamageFineBreakdown();

  return (
    <div className="space-y-6">
      {/* Active Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Active Borrowings ({activeTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No active borrowings</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTransactions.map((t) => (
                    <TableRow
                      key={t.id}
                      className={`cursor-pointer ${selectedTransaction === t.id ? 'bg-primary/5' : ''}`}
                      onClick={() => setSelectedTransaction(t.id)}
                    >
                      <TableCell className="font-medium">{t.bookName}</TableCell>
                      <TableCell>{t.borrowerName}</TableCell>
                      <TableCell>
                        <Badge variant={t.borrowingType === 'Group' ? 'default' : 'secondary'}>
                          {t.borrowingType}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(t.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(t.dueDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Return Form */}
      {selectedTransaction && (
        <Card>
          <CardHeader>
            <CardTitle>Return Book: {transaction?.bookName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {/* Damage Assessment */}
            <div className="space-y-3">
              <Label>Book Condition</Label>
              <RadioGroup value={damageType} onValueChange={(val) => setDamageType(val as any)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="None" id="none" />
                  <Label htmlFor="none" className="flex-1 cursor-pointer">
                    <p className="font-medium">No Damage</p>
                    <p className="text-sm text-muted-foreground">Book is in good condition</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg border-yellow-300">
                  <RadioGroupItem value="Small" id="small" />
                  <Label htmlFor="small" className="flex-1 cursor-pointer">
                    <p className="font-medium">Small Damage (10% fine)</p>
                    <p className="text-sm text-muted-foreground">Minor wear, small stains, bent pages</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg border-red-300">
                  <RadioGroupItem value="Large" id="large" />
                  <Label htmlFor="large" className="flex-1 cursor-pointer">
                    <p className="font-medium">Large Damage (50% fine)</p>
                    <p className="text-sm text-muted-foreground">Torn pages, water damage, missing pages</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Fine Calculation Display */}
            {fineBreakdown && fineBreakdown.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-red-900">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="font-bold">Fine Breakdown</p>
                </div>
                <div className="space-y-2">
                  {fineBreakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span className="font-medium">₹{item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-red-300 flex justify-between font-bold text-lg">
                    <span>Total Fine:</span>
                    <span className="text-red-700">₹{calculatedFine}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Warning for overdue */}
            {transaction && new Date() > new Date(transaction.dueDate) && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> This book is being returned after the due date. 
                  It will be marked as MISSING and full fines apply (200% of book price + ₹50/day late fee).
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={handleReturn} className="w-full" size="lg">
              <DollarSign className="mr-2 h-4 w-4" />
              Return Book {calculatedFine > 0 && `(Pay ₹${calculatedFine})`}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReturnBook;