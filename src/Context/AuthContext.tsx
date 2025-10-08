// src/context/AuthContext.tsx (Your main file)

import { createContext, useEffect, useReducer, useContext } from "react";
import AuthReducer from "./AuthReducer";
import { AuthState, AuthContextType, AuthAction, User } from "./AuthContext.types";

// --- 1. INITIAL STATE ---
const INITIAL_STATE: AuthState = {
    // Safely parse from localStorage, defaulting to null
    user: typeof window !== 'undefined' 
        ? (JSON.parse(localStorage.getItem("user") || 'null') as User)
        : null,
    isFetching: false,
    error: false,
};

// --- 2. CONTEXT CREATION ---
// Define the context with its expected type and a default mock dispatch function
export const AuthContext = createContext<AuthContextType>({
    ...INITIAL_STATE,
    dispatch: () => null, // Mock function for initial context value
});

// --- 3. CONTEXT PROVIDER ---
/* Provides state and dispatch function to all consuming components */
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE as AuthState);

    // Persist user data to localStorage whenever user state changes
    useEffect(() => {
        // Ensure localStorage only runs on the client side in Next.js
        if (typeof window !== 'undefined') {
            localStorage.setItem("user", JSON.stringify(state.user));
        }
    }, [state.user]);

    // Construct the context value
    const contextValue: AuthContextType = {
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch: dispatch as React.Dispatch<AuthAction>, // Type assertion for dispatch
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// --- 4. Custom Hook for Consumption ---
/**
 * Custom hook to consume the authentication context.
 * Ensures usage within the provider and provides type-safe context values.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
};