
export interface IMember {
    id: string;
    userFullName: string;
    userType: 'Student' | 'Faculty';
    admissionId?: string;
    employeeId?: string;
    points: number;
    activeTransactions?: ITransaction[];
}

export interface IBook {
    id: string;
    bookName: string;
    bookCountAvailable: number;
    // Add other book fields as necessary
}

export interface ITransaction {
    id: string;
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

export interface IMemberDetails {
    id: string;
    userFullName: string;
    userType: 'Student' | 'Faculty';
    admissionId?: string;
    employeeId?: string;
    email: string;
    mobileNumber: string;
    age: number;
    gender: string;
    dob: string;
    address: string;
    points: number;
    activeTransactions: ITransaction[];
    prevTransactions: ITransaction[];
}

export interface IDropdownOption {
    value: string;
    text: string;
}