// SignIn.tsx
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '@/Context/AuthContext'; 
import { User, AuthActionType } from '@/Context/AuthContext.types'; // Use the types from the improved context
import { Loader2, User as UserIcon, Briefcase } from "lucide-react"; 
import { useRouter } from 'next/router';

// --- Shadcn Imports ---
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Shadcn Switch component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

// --- TypeScript Interface for Auth Context Dispatch Action ---
interface AuthDispatch {
    (action: { type: AuthActionType, payload?: any }): void;
}

// --- Helper Hook for managing ID input ---
const useIdInput = (isStudent: boolean) => {
    // Only track the necessary IDs
    const [admissionId, setAdmissionId] = useState<string>('');
    const [employeeId, setEmployeeId] = useState<string>('');

    const currentId = isStudent ? admissionId : employeeId;
    const setId = isStudent ? setAdmissionId : setEmployeeId;
    const name = isStudent ? 'admissionId' : 'employeeId';
    const label = isStudent ? 'Admission ID' : 'Employee ID';
    const placeholder = isStudent ? 'e.g., S12345' : 'e.g., E987';

    return { currentId, setId, name, label, placeholder, admissionId, employeeId };
};

// --- Main SignIn Component ---
const SignIn: React.FC = () => {
    const [isStudent, setIsStudent] = useState<boolean>(true);
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    
    const router = useRouter();

    // Use the helper hook to manage the two different IDs
    const { currentId, setId, name, label, placeholder } = useIdInput(isStudent);

    // Context Hook: Using the structure from the improved AuthContext
    const { dispatch } = useContext(AuthContext) as { dispatch: AuthDispatch };

    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

    // Simplified loginCall function for type clarity and error handling
    const loginCall = async (
        userCredential: { admissionId?: string, employeeId?: string, password: string }, 
        dispatch: AuthDispatch
    ) => {
        dispatch({ type: AuthActionType.LOGIN_START });
        setLoading(true);
        setError('');
        
        try {
            const payload = isStudent
                ? { admissionId: userCredential.admissionId, password: userCredential.password }
                : { employeeId: userCredential.employeeId, password: userCredential.password };

            const res = await axios.post(`${API_URL}api/auth/signin`, payload);
            
            // Assume res.data contains the logged-in user object (type User)
            dispatch({ type: AuthActionType.LOGIN_SUCCESS, payload: res.data as User });
            
            // Redirect or handle post-login logic (e.g., router.push('/dashboard'))
            router.push('/dashboard');

        } catch (err) {
            let errorMessage = "An unexpected error occurred.";
            if (axios.isAxiosError(err) && err.response) {
                // Use a more generic message if the backend doesn't provide a specific one
                errorMessage = err.response.data.message || "Invalid credentials. Please try again.";
            } 
            
            setError(errorMessage);
            dispatch({ type: AuthActionType.LOGIN_FAILURE, payload: errorMessage });

        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const userCredential = isStudent
            ? { admissionId: currentId, password }
            : { employeeId: currentId, password };

        loginCall(userCredential, dispatch);
    };

    return (
        // Tailwind classes for modern, centered layout
        <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4'>
            {/* Shadcn Card for the form container */}
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-extrabold flex items-center justify-center space-x-2">
                        <span>Welcome Back!</span> 👋
                    </CardTitle>
                    <CardDescription>
                        Sign in to access the Library Management System.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        
                        {/* --- Staff/Student Switch (Shadcn Switch) --- */}
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                {isStudent ? (
                                    <UserIcon className="h-5 w-5 text-indigo-600" />
                                ) : (
                                    <Briefcase className="h-5 w-5 text-indigo-600" />
                                )}
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {isStudent ? "Log In as Student" : "Log In as Staff"}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="person-type-switch" className="text-sm text-gray-500">Staff</Label>
                                <Switch
                                    id="person-type-switch"
                                    checked={!isStudent} // checked when NOT student (i.e., staff)
                                    onCheckedChange={(checked) => {
                                        setIsStudent(!checked);
                                        setError(''); // Clear error on switch
                                    }}
                                />
                                <Label htmlFor="person-type-switch" className="text-sm text-gray-500">Student</Label>
                            </div>
                        </div>

                        {/* --- Error Message (Shadcn Alert) --- */}
                        {error && (
                            <Alert variant="destructive" className="flex items-center space-x-2">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle className="!mt-0">Error</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* --- Input Fields (Shadcn Label & Input) --- */}
                        <div className="space-y-4">
                            {/* ID Input */}
                            <div className="space-y-2">
                                <Label htmlFor={name}>{label}</Label>
                                <Input
                                    id={name}
                                    name={name}
                                    type="text"
                                    required
                                    value={currentId}
                                    onChange={(e) => setId(e.target.value)}
                                    placeholder={placeholder}
                                    disabled={loading}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* --- Login Button (Shadcn Button) --- */}
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Log In
                        </Button>
                    </form>

                    {/* --- Forgot Password Link --- */}
                    <div className="text-sm text-center">
                        <a
                            href="#"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Forgot your password?
                        </a>
                    </div>
                </CardContent>

                <CardFooter className="justify-center border-t pt-4">
                    {/* --- Sign Up Option --- */}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?
                        <a href='#' className="font-medium text-indigo-600 ml-1 cursor-pointer hover:text-indigo-500">
                            Contact Librarian
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default SignIn;