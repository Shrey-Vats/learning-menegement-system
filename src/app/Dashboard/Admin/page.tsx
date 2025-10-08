// src/app/Dashboard/Admin/page.tsx
'use client';

import React, { useState } from 'react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard, BookOpen, Receipt, RotateCcw, Users, UserPlus,
  MessageSquare, LogOut, Menu, TrendingUp, AlertCircle
} from 'lucide-react';

// Import Components
import BorrowBook from '@/components/BorrowBook';
import ReturnBook from '@/components/ReturnBook';
import FeedbackModule from '@/components/FeedbackModule';
import AddBook from '@/components/AddBook';
import AddMember from '@/components/AddMember';
import ViewMembers from '@/components/ViewMembers';
import DashboardStats from '@/components/DashboardStats';

const sidebarOptions = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'borrow', name: 'Issue/Reserve Book', icon: Receipt },
  { id: 'return', name: 'Return Book', icon: RotateCcw },
  { id: 'addbook', name: 'Add Book', icon: BookOpen },
  { id: 'members', name: 'View Members', icon: Users },
  { id: 'addmember', name: 'Add Member', icon: UserPlus },
  { id: 'feedback', name: 'Feedback', icon: MessageSquare },
];

const AdminDashboard = () => {
  const [active, setActive] = useState('dashboard');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { logout, currentUser } = useLibraryStore();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      window.location.href = '/signin';
    }
  };

  const renderContent = () => {
    switch (active) {
      case 'dashboard':
        return <DashboardStats />;
      case 'borrow':
        return <BorrowBook />;
      case 'return':
        return <ReturnBook />;
      case 'addbook':
        return <AddBook />;
      case 'members':
        return <ViewMembers />;
      case 'addmember':
        return <AddMember />;
      case 'feedback':
        return <FeedbackModule />;
      default:
        return <DashboardStats />;
    }
  };

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center space-x-3 px-6 py-4 border-b">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <div>
          <span className="text-xl font-extrabold text-foreground">LCMS Admin</span>
          <p className="text-xs text-muted-foreground">{currentUser?.userFullName}</p>
        </div>
      </div>

      {/* Navigation Links */}
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

      {/* Logout Option */}
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
      {/* Mobile Sidebar */}
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

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 border-r bg-card shadow-sm fixed inset-y-0 z-20">
        {navContent}
      </div>

      {/* Main Content Area */}
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

export default AdminDashboard;