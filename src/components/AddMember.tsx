// Components/AddMember.tsx
import React, { useEffect, useState } from 'react';
import axios from "axios";
import moment from 'moment';

// Import shadcn/ui components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // Assuming this utility function is available

interface RecentMember {
    _id: string;
    userType: 'Student' | 'Staff';
    userFullName: string;
    admissionId?: string;
    employeeId?: string;
}

function AddMember() {
    const API_URL = process.env.REACT_APP_API_URL;
    const [isLoading, setIsLoading] = useState(false);

    const [userFullName, setUserFullName] = useState<string>("");
    const [admissionId, setAdmissionId] = useState<string>("");
    const [employeeId, setEmployeeId] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [mobileNumber, setMobileNumber] = useState<string>("");
    const [userType, setUserType] = useState<'Student' | 'Staff'>('Student');
    const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
    const [age, setAge] = useState<number | ''>('');
    const [dob, setDob] = useState<Date | undefined>(undefined);
    const [recentAddedMembers, setRecentAddedMembers] = useState<RecentMember[]>([]);

    const genderTypes = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" }
    ];

    const userTypes = [
        { value: 'Staff', label: 'Staff' },
        { value: 'Student', label: 'Student' }
    ];

    //Add a Member
    const addMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const dobString = dob ? moment(dob).format("MM/DD/YYYY") : null;
        
        // Basic Validation
        if (!userFullName || !userType || !age || !dobString || !gender || !address || !mobileNumber || !email || !password || (userType === "Student" && !admissionId) || (userType === "Staff" && !employeeId)) {
            alert("All required fields must be filled!");
            setIsLoading(false);
            return;
        }

        const userData = {
            userType,
            userFullName,
            admissionId: userType === "Student" ? admissionId : undefined,
            employeeId: userType === "Staff" ? employeeId : undefined,
            age: Number(age),
            dob: dobString,
            gender,
            address,
            mobileNumber,
            email,
            password
        };

        try {
            const response = await axios.post(API_URL + "api/auth/register", userData);
            
            // Update recent members (keeping only the top 5)
            setRecentAddedMembers(prev => [response.data, ...prev.slice(0, 4)]);
            
            // Clear form
            setUserFullName("");
            setUserType("Student");
            setAdmissionId("");
            setEmployeeId("");
            setAddress("");
            setMobileNumber("");
            setEmail("");
            setPassword("");
            setGender("");
            setAge("");
            setDob(undefined);
            
            alert("Member Added Successfully!");
        } catch (err) {
            console.error("Error adding member:", err);
            alert("Failed to add member. Check console for details.");
        }
        setIsLoading(false);
    };

    //Fetch Members
    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(API_URL + "api/users/allmembers");
                setRecentAddedMembers(response.data.slice(0, 5));
            } catch (err) {
                console.error("Error fetching recent members:", err);
            }
        };
        getMembers();
    }, [API_URL]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 shadow-none border-none">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Register New Member</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={addMember}>
                        {/* Member Type Dropdown */}
                        <div>
                            <Label>Member Type <span className="text-red-500">*</span></Label>
                            <Select value={userType} onValueChange={(value: 'Student' | 'Staff') => { setUserType(value); setAdmissionId(""); setEmployeeId(""); }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select User Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {userTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div>
                                <Label htmlFor="userFullName">Full Name <span className="text-red-500">*</span></Label>
                                <Input id="userFullName" type="text" value={userFullName} required onChange={(e) => setUserFullName(e.target.value)} />
                            </div>

                            {/* ID Field (Conditional) */}
                            <div>
                                <Label htmlFor="memberId">{userType === "Student" ? "Admission ID" : "Employee ID"} <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="memberId" 
                                    type="text" 
                                    value={userType === "Student" ? admissionId : employeeId} 
                                    required 
                                    onChange={(e) => { userType === "Student" ? setAdmissionId(e.target.value) : setEmployeeId(e.target.value) }} 
                                />
                            </div>
                            
                            {/* Mobile Number */}
                            <div>
                                <Label htmlFor="mobileNumber">Mobile Number <span className="text-red-500">*</span></Label>
                                <Input id="mobileNumber" type="text" value={mobileNumber} required onChange={(e) => setMobileNumber(e.target.value)} />
                            </div>

                            {/* Gender Dropdown */}
                            <div>
                                <Label>Gender <span className="text-red-500">*</span></Label>
                                <Select value={gender} onValueChange={(value: 'Male' | 'Female') => setGender(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {genderTypes.map(type => (
                                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Age */}
                            <div>
                                <Label htmlFor="age">Age <span className="text-red-500">*</span></Label>
                                <Input id="age" type="number" value={age} required onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>

                            {/* Date of Birth Picker */}
                            <div>
                                <Label htmlFor="dob">Date of Birth <span className="text-red-500">*</span></Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !dob && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dob}
                                            onSelect={setDob}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            
                            {/* Email */}
                            <div className="md:col-span-2">
                                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                <Input id="email" type="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            {/* Password */}
                            <div className="md:col-span-2">
                                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                <Input id="password" type="password" value={password} required onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                                <Input id="address" value={address} type="text" required onChange={(e) => setAddress(e.target.value)} />
                            </div>
                        </div>

                        <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                            {isLoading ? "Registering..." : "Register Member"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Recently Added Members Table */}
            <Card className="lg:col-span-1 shadow-none border-none">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Recently Registered</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">S.No</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead className="text-right">Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentAddedMembers.map((member, index) => (
                                <TableRow key={member._id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{member.userType}</TableCell>
                                    <TableCell>{member.userType === "Student" ? member.admissionId : member.employeeId}</TableCell>
                                    <TableCell className="text-right">{member.userFullName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableCaption>{recentAddedMembers.length === 0 ? "No recent members added." : "Top 5 recently registered members."}</TableCaption>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default AddMember;