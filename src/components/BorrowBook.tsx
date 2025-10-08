// src/components/BorrowBook.tsx
import React, { useState } from 'react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Users, User as UserIcon, BookOpen, Calendar } from 'lucide-react';

const BorrowBook = () => {
  const { books, users, borrowBook, currentUser } = useLibraryStore();
  
  const [selectedBook, setSelectedBook] = useState('');
  const [borrowingType, setBorrowingType] = useState<'Individual' | 'Group'>('Individual');
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const availableBooks = books.filter((b) => b.availableCopies > 0);
  const availableUsers = users.filter((u) => !u.isAdmin && u.id !== currentUser?.id);

  const handleBorrow = () => {
    if (!selectedBook || !currentUser) {
      setMessage({ type: 'error', text: 'Please select a book' });
      return;
    }

    if (borrowingType === 'Group' && groupMembers.length < 2) {
      setMessage({ type: 'error', text: 'Group must have 3-6 members including you' });
      return;
    }

    if (borrowingType === 'Group' && groupMembers.length > 5) {
      setMessage({ type: 'error', text: 'Group cannot have more than 6 members' });
      return;
    }

    const result = borrowBook(selectedBook, currentUser.id, borrowingType, groupMembers);
    
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });

    if (result.success) {
      setSelectedBook('');
      setGroupMembers([]);
    }
  };

  const toggleGroupMember = (userId: string) => {
    setGroupMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const borrowingPeriod = borrowingType === 'Individual' ? '30 days (1 month)' : '180 days (6 months)';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Borrow a Book
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Book Selection */}
        <div className="space-y-2">
          <Label>Select Book</Label>
          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a book" />
            </SelectTrigger>
            <SelectContent>
              {availableBooks.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title} - {book.author} ({book.availableCopies} available)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Borrowing Type */}
        <div className="space-y-3">
          <Label>Borrowing Type</Label>
          <RadioGroup value={borrowingType} onValueChange={(val) => setBorrowingType(val as any)}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="Individual" id="individual" />
              <Label htmlFor="individual" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Individual Borrowing</p>
                    <p className="text-sm text-muted-foreground">30 days period</p>
                  </div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="Group" id="group" />
              <Label htmlFor="group" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Group Borrowing (3-6 members)</p>
                    <p className="text-sm text-muted-foreground">180 days period</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Group Members Selection */}
        {borrowingType === 'Group' && (
          <div className="space-y-2">
            <Label>Select Group Members ({groupMembers.length + 1}/6 selected)</Label>
            <div className="border rounded-lg p-3 max-h-60 overflow-y-auto space-y-2">
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    groupMembers.includes(user.id)
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleGroupMember(user.id)}
                >
                  <p className="font-medium">{user.userFullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.userType} - {user.admissionId || user.employeeId}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-blue-900">
            <Calendar className="h-4 w-4" />
            <p className="font-medium">Borrowing Period: {borrowingPeriod}</p>
          </div>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Each book category has 3 copies available</p>
            <p>• One book per person/group at a time</p>
            <p>• Late return fine: ₹50/day after due date</p>
            <p>• Missing book fine: 200% of book price + late fees</p>
          </div>
        </div>

        <Button onClick={handleBorrow} className="w-full" size="lg">
          Borrow Book
        </Button>
      </CardContent>
    </Card>
  );
};

export default BorrowBook;