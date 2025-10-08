// src/store/useLibraryStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==================== TYPES ====================
export type UserType = 'Student' | 'Staff' | 'Admin';

export type BorrowingType = 'Individual' | 'Group';

export interface User {
  id: string;
  userFullName: string;
  email: string;
  userType: UserType;
  admissionId?: string;
  employeeId?: string;
  mobileNumber: string;
  age: number;
  gender: string;
  dob: string;
  address: string;
  points: number;
  isAdmin: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverUrl: string;
  price: number; // Book price for fine calculation
  totalCopies: number; // Always 3 per category
  availableCopies: number;
  isPopular?: boolean;
  isRecent?: boolean;
}

export interface Transaction {
  id: string;
  bookId: string;
  bookName: string;
  borrowerId: string;
  borrowerName: string;
  borrowingType: BorrowingType;
  groupMembers?: string[]; // IDs of group members (3-6)
  fromDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Active' | 'Returned' | 'Missing' | 'Overdue';
  fine: number;
  damageType?: 'None' | 'Small' | 'Large';
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  bookId?: string;
  bookTitle?: string;
  title: string;
  comment: string;
  rating: number; // 1-5
  imageUrl?: string;
  createdAt: string;
}

interface LibraryState {
  // Auth
  currentUser: User | null;
  users: User[];
  
  // Books
  books: Book[];
  
  // Transactions
  transactions: Transaction[];
  
  // Feedback
  feedbacks: Feedback[];
  
  // Actions - Auth
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'points'>) => void;
  
  // Actions - Books
  addBook: (book: Omit<Book, 'id' | 'availableCopies'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  
  // Actions - Transactions
  borrowBook: (
    bookId: string,
    borrowerId: string,
    borrowingType: BorrowingType,
    groupMembers?: string[]
  ) => { success: boolean; message: string };
  
  returnBook: (
    transactionId: string,
    damageType?: 'None' | 'Small' | 'Large'
  ) => { success: boolean; message: string; fine: number };
  
  calculateFine: (transaction: Transaction, damageType?: 'None' | 'Small' | 'Large') => number;
  
  // Actions - Users
  updateUser: (id: string, updates: Partial<User>) => void;
  addUser: (user: Omit<User, 'id' | 'points'>) => void;
  
  // Actions - Feedback
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
  deleteFeedback: (id: string) => void;
  
  // Getters
  getActiveTransactions: () => Transaction[];
  getOverdueTransactions: () => Transaction[];
  getUserTransactions: (userId: string) => Transaction[];
  getBookTransactions: (bookId: string) => Transaction[];
}

// ==================== HELPER FUNCTIONS ====================
const generateId = () => Math.random().toString(36).substr(2, 9);

const calculateDaysDifference = (fromDate: string, toDate: string): number => {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diffTime = Math.abs(to.getTime() - from.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ==================== ZUSTAND STORE ====================
export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      users: [
        // Default admin user
        {
          id: 'admin1',
          userFullName: 'Admin User',
          email: 'admin@library.com',
          userType: 'Admin',
          employeeId: 'EMP001',
          mobileNumber: '9876543210',
          age: 35,
          gender: 'Male',
          dob: '1990-01-01',
          address: 'Library Admin Office',
          points: 1000,
          isAdmin: true,
        },
      ],
      books: [
        // Sample books
        {
          id: 'book1',
          title: 'Atomic Habits',
          author: 'James Clear',
          category: 'Self-Help',
          coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/51-uspgjGgL._SY300_.jpg',
          price: 500,
          totalCopies: 3,
          availableCopies: 3,
          isPopular: true,
          isRecent: false,
        },
        {
          id: 'book2',
          title: 'Rich Dad Poor Dad',
          author: 'Robert Kiyosaki',
          category: 'Finance',
          coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/81bsw6fnUiL._SY300_.jpg',
          price: 400,
          totalCopies: 3,
          availableCopies: 3,
          isPopular: true,
          isRecent: true,
        },
      ],
      transactions: [],
      feedbacks: [],

      // ==================== AUTH ACTIONS ====================
      login: async (email: string, password: string) => {
        const users = get().users;
        const user = users.find((u) => u.email === email);
        
        if (user) {
          set({ currentUser: user });
          return user;
        }
        return null;
      },

      logout: () => {
        set({ currentUser: null });
      },

      register: (userData) => {
        const newUser: User = {
          ...userData,
          id: generateId(),
          points: 100, // Starting points
        };
        set((state) => ({
          users: [...state.users, newUser],
        }));
      },

      // ==================== BOOK ACTIONS ====================
      addBook: (bookData) => {
        const newBook: Book = {
          ...bookData,
          id: generateId(),
          availableCopies: bookData.totalCopies,
        };
        set((state) => ({
          books: [...state.books, newBook],
        }));
      },

      updateBook: (id, updates) => {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id ? { ...book, ...updates } : book
          ),
        }));
      },

      deleteBook: (id) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        }));
      },

      // ==================== TRANSACTION ACTIONS ====================
      borrowBook: (bookId, borrowerId, borrowingType, groupMembers = []) => {
        const state = get();
        const book = state.books.find((b) => b.id === bookId);
        const user = state.users.find((u) => u.id === borrowerId);

        if (!book || !user) {
          return { success: false, message: 'Book or User not found' };
        }

        if (book.availableCopies < 1) {
          return { success: false, message: 'No copies available' };
        }

        // Validate group borrowing
        if (borrowingType === 'Group') {
          if (groupMembers.length < 2 || groupMembers.length > 5) {
            return {
              success: false,
              message: 'Group must have 3-6 members (including borrower)',
            };
          }
        }

        // Check if user already has an active transaction
        const activeUserTransactions = state.transactions.filter(
          (t) => t.borrowerId === borrowerId && t.status === 'Active'
        );

        if (activeUserTransactions.length > 0) {
          return {
            success: false,
            message: 'User already has an active borrowing',
          };
        }

        // Calculate due date
        const fromDate = new Date().toISOString();
        const dueDate = new Date();
        
        if (borrowingType === 'Individual') {
          dueDate.setDate(dueDate.getDate() + 30); // 30 days
        } else {
          dueDate.setDate(dueDate.getDate() + 180); // 180 days
        }

        const newTransaction: Transaction = {
          id: generateId(),
          bookId,
          bookName: book.title,
          borrowerId,
          borrowerName: user.userFullName,
          borrowingType,
          groupMembers: borrowingType === 'Group' ? [borrowerId, ...groupMembers] : undefined,
          fromDate,
          dueDate: dueDate.toISOString(),
          status: 'Active',
          fine: 0,
          createdAt: fromDate,
          updatedAt: fromDate,
        };

        set((state) => ({
          transactions: [...state.transactions, newTransaction],
          books: state.books.map((b) =>
            b.id === bookId
              ? { ...b, availableCopies: b.availableCopies - 1 }
              : b
          ),
        }));

        return { success: true, message: 'Book borrowed successfully' };
      },

      returnBook: (transactionId, damageType = 'None') => {
        const state = get();
        const transaction = state.transactions.find((t) => t.id === transactionId);

        if (!transaction) {
          return { success: false, message: 'Transaction not found', fine: 0 };
        }

        const fine = get().calculateFine(transaction, damageType);
        const returnDate = new Date().toISOString();
        const book = state.books.find((b) => b.id === transaction.bookId);

        // Determine status based on return date
        const dueDate = new Date(transaction.dueDate);
        const returnDateObj = new Date(returnDate);
        const status = returnDateObj > dueDate ? 'Missing' : 'Returned';

        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === transactionId
              ? {
                  ...t,
                  returnDate,
                  status,
                  fine,
                  damageType,
                  updatedAt: returnDate,
                }
              : t
          ),
          books: state.books.map((b) =>
            b.id === transaction.bookId
              ? { ...b, availableCopies: b.availableCopies + 1 }
              : b
          ),
          users: state.users.map((u) =>
            u.id === transaction.borrowerId
              ? { ...u, points: Math.max(0, u.points - Math.floor(fine / 10)) }
              : u
          ),
        }));

        return {
          success: true,
          message: `Book returned. Fine: ₹${fine}`,
          fine,
        };
      },

      calculateFine: (transaction, damageType = 'None') => {
        const state = get();
        const book = state.books.find((b) => b.id === transaction.bookId);
        
        if (!book) return 0;

        const dueDate = new Date(transaction.dueDate);
        const returnDate = transaction.returnDate
          ? new Date(transaction.returnDate)
          : new Date();

        let fine = 0;

        // If returned after due date - considered MISSING
        if (returnDate > dueDate) {
          // 200% of book price for missing
          fine += book.price * 2;

          // Additional late fee: ₹50 per day
          const daysLate = calculateDaysDifference(
            transaction.dueDate,
            returnDate.toISOString()
          );
          fine += daysLate * 50;
        }

        // Damage fine
        if (damageType === 'Small') {
          fine += book.price * 0.1; // 10% of book price
        } else if (damageType === 'Large') {
          fine += book.price * 0.5; // 50% of book price
        }

        return Math.round(fine);
      },

      // ==================== USER ACTIONS ====================
      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        }));
      },

      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: generateId(),
          points: 100,
        };
        set((state) => ({
          users: [...state.users, newUser],
        }));
      },

      // ==================== FEEDBACK ACTIONS ====================
      addFeedback: (feedbackData) => {
        const newFeedback: Feedback = {
          ...feedbackData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          feedbacks: [...state.feedbacks, newFeedback],
        }));
      },

      deleteFeedback: (id) => {
        set((state) => ({
          feedbacks: state.feedbacks.filter((f) => f.id !== id),
        }));
      },

      // ==================== GETTERS ====================
      getActiveTransactions: () => {
        return get().transactions.filter((t) => t.status === 'Active');
      },

      getOverdueTransactions: () => {
        const now = new Date();
        return get().transactions.filter(
          (t) => t.status === 'Active' && new Date(t.dueDate) < now
        );
      },

      getUserTransactions: (userId) => {
        return get().transactions.filter((t) => t.borrowerId === userId);
      },

      getBookTransactions: (bookId) => {
        return get().transactions.filter((t) => t.bookId === bookId);
      },
    }),
    {
      name: 'library-storage',
    }
  )
);