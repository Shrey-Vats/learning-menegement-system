// src/components/DashboardStats.tsx
import React from 'react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';

const DashboardStats = () => {
  const { books, users, transactions, getActiveTransactions, getOverdueTransactions } = useLibraryStore();

  const activeTransactions = getActiveTransactions();
  const overdueTransactions = getOverdueTransactions();
  
  const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
  const borrowedBooks = totalBooks - availableBooks;
  
  const totalFines = transactions
    .filter(t => t.fine > 0)
    .reduce((sum, t) => sum + t.fine, 0);

  const stats = [
    {
      title: 'Total Books',
      value: totalBooks,
      subtitle: `${availableBooks} available`,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Active Borrowings',
      value: activeTransactions.length,
      subtitle: `${overdueTransactions.length} overdue`,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-50',
    },
    {
      title: 'Total Members',
      value: users.filter(u => !u.isAdmin).length,
      subtitle: 'Registered users',
      icon: Users,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Total Fines',
      value: `₹${totalFines}`,
      subtitle: 'Collected',
      icon: DollarSign,
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overdue Transactions Alert */}
      {overdueTransactions.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Overdue Books ({overdueTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead>Est. Fine</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueTransactions.slice(0, 5).map((t) => {
                    const daysOverdue = Math.ceil(
                      (new Date().getTime() - new Date(t.dueDate).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const book = books.find(b => b.id === t.bookId);
                    const estimatedFine = book ? (book.price * 2) + (daysOverdue * 50) : 0;
                    
                    return (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.bookName}</TableCell>
                        <TableCell>{t.borrowerName}</TableCell>
                        <TableCell>{new Date(t.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{daysOverdue} days</Badge>
                        </TableCell>
                        <TableCell className="font-bold text-red-600">
                          ₹{estimatedFine}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(-10).reverse().map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.bookName}</TableCell>
                    <TableCell>{t.borrowerName}</TableCell>
                    <TableCell>
                      <Badge variant={t.borrowingType === 'Group' ? 'default' : 'secondary'}>
                        {t.borrowingType}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(t.fromDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          t.status === 'Active'
                            ? 'default'
                            : t.status === 'Returned'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Popular Books */}
      <Card>
        <CardHeader>
          <CardTitle>Book Inventory Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Total Copies</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell>{book.totalCopies}</TableCell>
                    <TableCell>
                      <Badge
                        variant={book.availableCopies === 0 ? 'destructive' : 'secondary'}
                      >
                        {book.availableCopies}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{book.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;