// src/types/member.ts (Create this file)

// Minimal user details from AuthContext
export interface AuthUser {
    id: string;
    // Add other properties if available, e.g., username, isAdmin
}

// Transaction data structure
export interface Transaction {
    bookName: string;
    fromDate: string;
    toDate: string;
    transactionType: "Issued" | "Reserved";
    returnDate?: string; // Only for previous transactions
    // Add other fields like bookId, ISBN, etc.
}

// Full member details structure from the API
export interface MemberDetails {
    _id: string;
    userFullName: string;
    userType: "Student" | "Staff";
    admissionId?: string;
    employeeId?: string;
    email: string;
    mobileNumber: string;
    age: number;
    gender: string;
    dob: string;
    address: string;
    points: number;
    activeTransactions: Transaction[];
    prevTransactions: Transaction[];
}

// Minimal Auth Context shape for use in this component
export interface AuthContextType {
    user: AuthUser | null;
    dispatch: (action: { type: string, payload?: any }) => void; // Keep this minimal
}