// src/app/Dashboard/Member/page.tsx
'use client';

import React, { useState } from 'react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  User, BookOpen, Clock, Award, LogOut, Menu, AlertTriangle, Calendar
} from 'lucide-react';

const sidebarOptions = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'active', name: 'Active Books', icon: BookOpen },
  { id: 'history', name: 'History', icon: Clock },
];

const MemberDashboard = () => {
  const [active, setActive] = useState('profile');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { currentUser, logout, getUserTransactions, books, calculateFine } = useLibraryStore();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to access the dashboard</p>
      </div>
    );
  }

  const userTransactions = getUserTransactions(currentUser.id);
  const activeTransactions = userTransactions.filter(t => t.status === 'Active');
  const completedTransactions = userTransactions.filter(t => t.status === 'Returned' || t.status === 'Missing');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      window.location.href = '/signin';
    }
  };

  const renderContent = () => {
    switch (active) {
      case 'profile':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-semibold text-lg">{currentUser.userFullName}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">User Type</p>
                    <Badge className="mt-1">{currentUser.userType}</Badge>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">ID</p>
                    <p className="font-medium">{currentUser.admissionId || currentUser.employeeId}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{currentUser.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Mobile</p>
                    <p className="font-medium">{currentUser.mobileNumber}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <p className="text-sm text-muted-foreground">Library Points</p>
                    <p className="font-bold text-2xl text-green-600 flex items-center gap-2">
                      <Award className="h-6 w-6" />
                      {currentUser.points}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Books</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{activeTransactions.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{userTransactions.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Fines Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-600">
                    ₹{userTransactions.reduce((sum, t) => sum + t.fine, 0)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Important Rules */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900">
                  <AlertTriangle className="h-5 w-5" />
                  Library Rules & Fines
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-yellow-900 space-y-2">
                <p><strong>Borrowing Periods:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Individual: 30 days (1 month)</li>
                  <li>Group (3-6 members): 180 days (6 months)</li>
                  <li>One book per person/group at a time</li>
                </ul>
                <p className="mt-3"><strong>Fine Structure:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Missing book (after deadline): 200% of book price</li>
                  <li>Late return: ₹50 per day after due date</li>
                  <li>Small damage: 10% of book price</li>
                  <li>Large damage: 50% of book price</li>
                </ul>
                <p className="mt-3 font-semibold text-red-700">
                  ⚠️ Books returned after the deadline are considered MISSING and full fines apply!
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'active':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Active Borrowings ({activeTransactions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTransactions.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No active borrowings
                </p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Borrowed On</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeTransactions.map((t) => {
                        const daysRemaining = Math.ceil(
                          (new Date(t.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                        );
                        const isOverdue = daysRemaining < 0;
                        
                        return (
                          <TableRow key={t.id}>
                            <TableCell className="font-medium">{t.bookName}</TableCell>
                            <TableCell>
                              <Badge variant={t.borrowingType === 'Group' ? 'default' : 'secondary'}>
                                {t.borrowingType}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(t.fromDate).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(t.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {isOverdue ? (
                                <Badge variant="destructive">
                                  Overdue by {Math.abs(daysRemaining)} days
                                </Badge>
                              ) : daysRemaining <= 7 ? (
                                <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                                  Due in {daysRemaining} days
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  {daysRemaining} days left
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'history':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Transaction History ({completedTransactions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedTransactions.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No transaction history
                </p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Borrowed</TableHead>
                        <TableHead>Returned</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Fine</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedTransactions.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.bookName}</TableCell>
                          <TableCell>
                            <Badge variant={t.borrowingType === 'Group' ? 'default' : 'secondary'}>
                              {t.borrowingType}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(t.fromDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {t.returnDate ? new Date(t.returnDate).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                t.status === 'Returned' ? 'secondary' : 'destructive'
                              }
                            >
                              {t.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {t.fine > 0 ? (
                              <span className="font-bold text-red-600">₹{t.fine}</span>
                            ) : (
                              '₹0'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-3 px-6 py-4 border-b">
        <BookOpen className="h-6 w-6 text-primary" />
        <div>
          <span className="text-xl font-extrabold text-foreground">LCMS</span>
          <p className="text-xs text-muted-foreground">{currentUser.userFullName}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {sidebarOptions.map((option) => (
          <Button
            key={option.id}
            variant={active === option.id ? 'secondary' : 'ghost'}
            className="w-full justify-start text-base font-normal"
            onClick={() => {
              setActive(option.id);
              setIsSheetOpen(false);
            }}
          >
            <option.icon className="w-5 h-5 mr-3" />
            {option.name}
          </Button>
        ))}
      </nav>

      <Separator />

      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-base font-normal text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            {navContent}
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:flex w-64 border-r bg-card shadow-sm fixed inset-y-0 z-20">
        {navContent}
      </div>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 w-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8 capitalize">
            {sidebarOptions.find((opt) => opt.id === active)?.name || active}
          </h1>
          <div className="dashboard-content-wrapper">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;