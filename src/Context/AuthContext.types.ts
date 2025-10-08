// src/context/AuthContext.types.ts (Create this file)

// 1. Define the User type (replace with your actual user object structure)
export type User = {
    _id: string;
    username: string;
    email: string;
    // Add any other user properties here (e.g., token, isAdmin)
    token?: string;
} | null; // User can be an object or null

// 2. Define the State type
export type AuthState = {
    user: User;
    isFetching: boolean;
    error: boolean;
};

// 3. Define the Action types
export enum AuthActionType {
    LOGIN_START = "LOGIN_START",
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGIN_FAILURE = "LOGIN_FAILURE",
    LOGOUT = "LOGOUT",
}

// 4. Define the Action structure
export type AuthAction = 
    | { type: AuthActionType.LOGIN_START }
    | { type: AuthActionType.LOGIN_SUCCESS; payload: User }
    | { type: AuthActionType.LOGIN_FAILURE; payload: any }
    | { type: AuthActionType.LOGOUT };

// 5. Define the Context structure (State + Dispatch function)
export type AuthContextType = AuthState & {
    dispatch: React.Dispatch<AuthAction>;
};