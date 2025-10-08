// MemberDashboard.tsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
    LayoutDashboard, LibraryIcon, User, BookOpen, Clock, ListOrdered, LogOut, Menu, X // Lucide Icons
} from "lucide-react"; 

// Import types and components
import { AuthContextType, AuthUser, MemberDetails } from "@/types/member";
import ProfileCard from "@/components/ProfileCard";
import TransactionTable from "@/components/TransactionTable";

// Type assertion for AuthContext (you should properly type your context provider)
const AuthContext = React.createContext<AuthContextType>({ user: null, dispatch: () => {} });

// Helper array for sidebar options
const sidebarOptions = [
    { id: "profile", name: "Profile", icon: User, hash: "#profile" },
    { id: "active", name: "Active Books", icon: BookOpen, hash: "#activebooks" },
    { id: "reserved", name: "Reserved", icon: ListOrdered, hash: "#reservedbook" },
    { id: "history", name: "History", icon: Clock, hash: "#history" },
];

const MemberDashboard: React.FC = () => {
    const [active, setActive] = useState<string>("profile");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [memberDetails, setMemberDetails] = useState<MemberDetails | null>(null);

    // Use Context with type assertion (assuming AuthContext.js needs to be typed)
    const { user, dispatch } = useContext(AuthContext) as AuthContextType;

    const API_URL = process.env.REACT_APP_API_URL || "";

    // --- Data Fetching Effect ---
    useEffect(() => {
        if (!user?.id) return;

        const getMemberDetails = async () => {
            try {
                // Ensure user._id is passed and API_URL is defined
                const response = await axios.get<MemberDetails>(
                    `${API_URL}api/users/getuser/${user.id}`
                );
                setMemberDetails(response.data);
            } catch (err) {
                console.error("Error fetching member details:", err);
                // Optionally handle error state
            }
        };
        getMemberDetails();
    }, [API_URL, user?.id]); // Depend on user._id for re-fetching

    // --- Logout Function ---
    const logout = () => {
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" }); // Dispatch a logout action (assuming your AuthContext supports it)
        window.location.reload();
    };

    // --- Conditional Content Renderer ---
    const renderContent = () => {
        if (!memberDetails) {
            return (
                <div className="flex justify-center items-center h-full p-10">
                    <p className="text-xl text-gray-500">Loading user data...</p>
                </div>
            );
        }

        switch (active) {
            case "profile":
                return <ProfileCard memberDetails={memberDetails} />;
            case "active":
                return (
                    <TransactionTable 
                        title="Issued Books"
                        transactions={memberDetails.activeTransactions}
                        type="Issued"
                    />
                );
            case "reserved":
                return (
                    <TransactionTable 
                        title="Reserved Books"
                        transactions={memberDetails.activeTransactions}
                        type="Reserved"
                    />
                );
            case "history":
                return (
                    <TransactionTable 
                        title="Previous Transactions"
                        transactions={memberDetails.prevTransactions}
                        type="History"
                    />
                );
            default:
                return <ProfileCard memberDetails={memberDetails} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar Toggle Button (Mobile) */}
            <button
                className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-indigo-600 text-white rounded-full shadow-lg"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* --- Sidebar / Dashboard Options --- */}
            <div
                className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 
                w-64 bg-white shadow-xl flex flex-col pt-4 pb-6 overflow-y-auto`}
            >
                {/* Logo */}
                <div className="flex items-center space-x-3 px-6 py-4 border-b">
                    <LibraryIcon style={{ fontSize: 32, color: '#4f46e5' }} /> {/* Still using MUI icon for large logo */}
                    <span className="text-2xl font-extrabold text-gray-900">LCMS</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {sidebarOptions.map((option) => (
                        <a
                            key={option.id}
                            href={option.hash}
                            className={`flex items-center px-4 py-2 rounded-lg transition duration-150 ease-in-out 
                            ${active === option.id
                                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            onClick={(e) => {
                                // e.preventDefault(); // Keep default behavior to update hash for linking/refresh
                                setActive(option.id);
                                setSidebarOpen(false); // Close sidebar on click on mobile
                            }}
                        >
                            <option.icon className="w-5 h-5 mr-3" />
                            {option.name}
                        </a>
                    ))}
                    
                    {/* Logout Option */}
                    <button
                        className="w-full flex items-center px-4 py-2 rounded-lg transition duration-150 ease-in-out text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold mt-4"
                        onClick={logout}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Log out
                    </button>
                </nav>
            </div>

            {/* --- Main Content Area --- */}
            <main className="flex-1 lg:ml-64 p-4 sm:p-8 pt-20 lg:pt-8 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 capitalize">{active} Dashboard</h1>
                <div className="dashboard-content-wrapper">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default MemberDashboard;