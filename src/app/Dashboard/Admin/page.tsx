// AdminDashboard.tsx
import React, { useState } from 'react';
// Assuming these components are located at:
import AddTransaction from '@/components/AddTransaction';
import AddMember from '@/components/AddMember';
import AddBook from '@/components/AddBook';
import GetMember from '@/components/GetMember';
import Return from '@/components/Return';

// Import Lucide Icons
import {
    LayoutDashboard, User, BookA, Receipt, UserPlus, Users, RotateCcw, LogOut, Menu, X
} from 'lucide-react';

// Import shadcn/ui components
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

// --- Sidebar Options Configuration ---
const sidebarOptions = [
    { id: "profile", name: "Profile", icon: User },
    { id: "addbook", name: "Add Book", icon: BookA },
    { id: "addtransaction", name: "Issue/Reserve Book", icon: Receipt },
    { id: "returntransaction", name: "Return Book", icon: RotateCcw },
    { id: "getmember", name: "View Member", icon: Users },
    { id: "addmember", name: "Add Member", icon: UserPlus },
];

const AdminDashboard: React.FC = () => {
    const [active, setActive] = useState<string>("addbook");
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

    /* Logout Function (retained)*/
    const logout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    };

    // --- Content Renderer ---
    const renderContent = () => {
        switch (active) {
            case "profile":
                // Assuming you'll create a Profile component for Admin
                return <div>Admin Profile Content (To be created)</div>;
            case "addbook":
                return <AddBook />;
            case "addtransaction":
                // Assuming AddTransaction is already migrated/working
                return <AddTransaction />;
            case "getmember":
                // Assuming GetMember is already migrated/working
                return <GetMember />;
            case "addmember":
                return <AddMember />;
            case "returntransaction":
                // Assuming Return is already migrated/working
                return <Return />;
            default:
                return <AddBook />;
        }
    };

    const navContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center space-x-3 px-6 py-4 border-b">
                <LayoutDashboard className="h-6 w-6 text-primary" />
                <span className="text-xl font-extrabold text-foreground">Admin LCMS</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {sidebarOptions.map((option) => (
                    <Button
                        key={option.id}
                        variant={active === option.id ? "secondary" : "ghost"}
                        className="w-full justify-start text-base font-normal"
                        onClick={() => {
                            setActive(option.id);
                            setIsSheetOpen(false); // Close sheet on mobile
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
                    onClick={logout}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Log out
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            
            {/* --- Mobile Sidebar (Sheet Component) --- */}
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

            {/* --- Desktop Sidebar (Fixed) --- */}
            <div className="hidden lg:flex w-64 border-r bg-card shadow-sm fixed inset-y-0 z-20">
                {navContent}
            </div>

            {/* --- Main Content Area --- */}
            <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 w-full">
                <h1 className="text-3xl font-bold text-foreground mb-8 capitalize">
                    {sidebarOptions.find(opt => opt.id === active)?.name || active}
                </h1>
                <div className="dashboard-content-wrapper bg-white p-6 rounded-xl shadow-lg">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;