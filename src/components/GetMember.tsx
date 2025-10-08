// src/components/AdminDashboard/GetMember/GetMember.tsx

import React, { useEffect, useState, useCallback } from 'react';
import axios from "axios";
import moment from "moment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { IDropdownOption, IMemberDetails } from '@/types/adminDashboard';

// --- TypeScript Interfaces ---


// --- Utility Function for Fine Calculation ---
const calculateFine = (toDateString: string): number => {
    const today = moment().startOf('day');
    const dueDate = moment(toDateString, "MM/DD/YYYY").startOf('day');
    const daysOverdue = today.diff(dueDate, 'days');
    return daysOverdue > 0 ? daysOverdue * 10 : 0;
};
// ---------------------------------------------

const API_URL = process.env.REACT_APP_API_URL;

function GetMember() {
    const [allMembersOptions, setAllMembersOptions] = useState<IDropdownOption[]>([]);
    const [memberId, setMemberId] = useState<string>("");
    const [memberDetails, setMemberDetails] = useState<IMemberDetails | null>(null);

    // Fetch Members
    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(`${API_URL}api/users/allmembers`);
                const options: IDropdownOption[] = response.data.map((member: IMemberDetails) => ({
                    value: member.id,
                    text: `${member.userFullName}[${member.userType === "Student" ? member.admissionId : member.employeeId}]`
                }));
                setAllMembersOptions(options);
            } catch (err) {
                console.error("Error fetching members:", err);
            }
        };
        getMembers();
    }, [API_URL]);

    // Fetch Member Details
    useEffect(() => {
        const getMemberDetails = async () => {
            if (!memberId) {
                setMemberDetails(null);
                return;
            }
            try {
                const response = await axios.get<IMemberDetails>(`${API_URL}api/users/getuser/${memberId}`);
                setMemberDetails(response.data);
            } catch (err) {
                console.error("Error in fetching the member details", err);
                setMemberDetails(null);
            }
        };
        getMemberDetails();
    }, [API_URL, memberId]);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Search Member Details</h2>
            <div className="h-px bg-gray-200 w-full" />

            <div className='max-w-lg'>
                <Select value={memberId} onValueChange={setMemberId}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Member" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                        {allMembersOptions.map((member) => (
                            <SelectItem key={member.value} value={member.value}>{member.text}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {memberDetails && (
                <div className='space-y-8'>
                    {/* User Profile Section */}
                    <div className="flex flex-col md:flex-row p-4 border rounded-lg shadow-sm bg-white">
                        <img className="w-24 h-24 rounded-full object-cover mr-6 mb-4 md:mb-0" src="./assets/images/Profile.png" alt="Profile" />
                        <div className="flex-1 space-y-1">
                            <p className="text-2xl font-bold">{memberDetails.userFullName}</p>
                            <p className="text-gray-600">{memberDetails.userType === "Student" ? memberDetails.admissionId : memberDetails.employeeId}</p>
                            <p className="text-gray-600">{memberDetails.email}</p>
                            <p className="text-gray-600">{memberDetails.mobileNumber}</p>

                            <div className="flex space-x-8 pt-4">
                                <div className='flex flex-col'>
                                    <span className="text-lg font-bold">Age</span>
                                    <span className="text-base">{memberDetails.age}</span>
                                </div>
                                <div className='flex flex-col'>
                                    <span className="text-lg font-bold">Gender</span>
                                    <span className="text-base">{memberDetails.gender}</span>
                                </div>
                                <div className='flex flex-col'>
                                    <span className="text-lg font-bold">DOB</span>
                                    <span className="text-base">{memberDetails.dob}</span>
                                </div>
                                <div className='flex flex-col'>
                                    <span className="text-lg font-bold">Address</span>
                                    <span className="text-base">{memberDetails.address}</span>
                                </div>
                            </div>

                        </div>
                        <div className="w-full md:w-auto mt-4 md:mt-0 md:ml-6 flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-xl font-bold">Points</p>
                                <p className="text-3xl font-semibold mt-2 text-green-600">{memberDetails.points}</p>
                            </div>
                        </div>
                    </div>

                    {/* Active/Reserved/History Transactions */}
                    <div className='space-y-6'>
                        {/* Issued Books */}
                        <h3 className="text-xl font-bold">Issued Books</h3>
                        <div className="border rounded-lg overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                                        <TableHead className="w-[50px]">S.No</TableHead>
                                        <TableHead>Book Name</TableHead>
                                        <TableHead>From Date</TableHead>
                                        <TableHead>To Date</TableHead>
                                        <TableHead>Fine</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {memberDetails.activeTransactions
                                        .filter(data => data.transactionType === "Issued")
                                        .map((data, index) => (
                                            <TableRow key={data.id || index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-medium">{data.bookName}</TableCell>
                                                <TableCell>{data.fromDate}</TableCell>
                                                <TableCell>{data.toDate}</TableCell>
                                                <TableCell className={calculateFine(data.toDate) > 0 ? "text-red-600 font-bold" : ""}>
                                                    &#8377;{calculateFine(data.toDate)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Reserved Books */}
                        <h3 className="text-xl font-bold pt-4">Reserved Books</h3>
                        <div className="border rounded-lg overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                                        <TableHead className="w-[50px]">S.No</TableHead>
                                        <TableHead>Book Name</TableHead>
                                        <TableHead>From Date</TableHead>
                                        <TableHead>To Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {memberDetails.activeTransactions
                                        .filter(data => data.transactionType === "Reserved")
                                        .map((data, index) => (
                                            <TableRow key={data.id || index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-medium">{data.bookName}</TableCell>
                                                <TableCell>{data.fromDate}</TableCell>
                                                <TableCell>{data.toDate}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* History */}
                        <h3 className="text-xl font-bold pt-4">Transaction History</h3>
                        <div className="border rounded-lg overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                                        <TableHead className="w-[50px]">S.No</TableHead>
                                        <TableHead>Book Name</TableHead>
                                        <TableHead>From Date</TableHead>
                                        <TableHead>To Date</TableHead>
                                        <TableHead>Return Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {memberDetails.prevTransactions
                                        .map((data, index) => (
                                            <TableRow key={data.id || index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-medium">{data.bookName}</TableCell>
                                                <TableCell>{data.fromDate}</TableCell>
                                                <TableCell>{data.toDate}</TableCell>
                                                <TableCell>{data.returnDate}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GetMember;