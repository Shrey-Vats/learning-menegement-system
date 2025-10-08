// src/components/ViewMembers.tsx
import React, { useState } from 'react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Search, Award, BookOpen, Mail, Phone, MapPin, Calendar, User as UserIcon } from 'lucide-react';

const ViewMembers = () => {
  const { users, getUserTransactions, books } = useLibraryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Filter out admin users to get only members
  const members = users.filter((u) => !u.isAdmin);

  // Search filtering
  const filteredMembers = members.filter(
    (m) =>
      m.userFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.admissionId && m.admissionId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.employeeId && m.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get selected user data
  const selectedUser = users.find((u) => u.id === selectedUserId);
  const userTransactions = selectedUserId ? getUserTransactions(selectedUserId) : [];

  // Calculate stats for selected user
  const activeTransactions = userTransactions.filter(t => t.status === 'Active');
  const totalFinesPaid = userTransactions.reduce((sum, t) => sum + t.fine, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Members Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No members found matching your search
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{member.userFullName}</TableCell>
                      <TableCell>
                        <Badge variant={member.userType === 'Student' ? 'default' : 'secondary'}>
                          {member.userType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {member.admissionId || member.employeeId}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.mobileNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{member.points}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUserId(member.id)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                Member Details
                              </DialogTitle>
                            </DialogHeader>
                            
                            {selectedUser && (
                              <div className="space-y-6">
                                {/* Profile Section */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Personal Information</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                          <UserIcon className="h-4 w-4" />
                                          <p className="text-sm">Full Name</p>
                                        </div>
                                        <p className="font-semibold">{selectedUser.userFullName}</p>
                                      </div>
                                      
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">User Type</p>
                                        <Badge>{selectedUser.userType}</Badge>
                                      </div>
                                      
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">ID Number</p>
                                        <p className="font-mono font-medium">
                                          {selectedUser.admissionId || selectedUser.employeeId}
                                        </p>
                                      </div>
                                      
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                          <Mail className="h-4 w-4" />
                                          <p className="text-sm">Email</p>
                                        </div>
                                        <p className="font-medium text-sm break-all">{selectedUser.email}</p>
                                      </div>
                                      
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                          <Phone className="h-4 w-4" />
                                          <p className="text-sm">Mobile</p>
                                        </div>
                                        <p className="font-medium">{selectedUser.mobileNumber}</p>
                                      </div>
                                      
                                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-2 text-green-700 mb-1">
                                          <Award className="h-4 w-4" />
                                          <p className="text-sm font-medium">Library Points</p>
                                        </div>
                                        <p className="text-2xl font-bold text-green-600">
                                          {selectedUser.points}
                                        </p>
                                      </div>
                                      
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">Age</p>
                                        <p className="font-medium">{selectedUser.age} years</p>
                                      </div>
                                      
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">Gender</p>
                                        <p className="font-medium">{selectedUser.gender}</p>
                                      </div>
                                      
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                          <Calendar className="h-4 w-4" />
                                          <p className="text-sm">Date of Birth</p>
                                        </div>
                                        <p className="font-medium">
                                          {new Date(selectedUser.dob).toLocaleDateString()}
                                        </p>
                                      </div>
                                      
                                      <div className="p-3 bg-gray-50 rounded-lg md:col-span-2 lg:col-span-3">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                          <MapPin className="h-4 w-4" />
                                          <p className="text-sm">Address</p>
                                        </div>
                                        <p className="font-medium">{selectedUser.address}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Statistics Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Active Books
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-3xl font-bold text-blue-600">
                                        {activeTransactions.length}
                                      </p>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Total Borrowed
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-3xl font-bold text-green-600">
                                        {userTransactions.length}
                                      </p>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Total Fines
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-3xl font-bold text-red-600">
                                        ₹{totalFinesPaid}
                                      </p>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Transaction History */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <BookOpen className="h-5 w-5" />
                                      Transaction History ({userTransactions.length})
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    {userTransactions.length === 0 ? (
                                      <p className="text-center py-8 text-muted-foreground">
                                        No transactions yet
                                      </p>
                                    ) : (
                                      <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                          <TableHeader>
                                            <TableRow className="bg-gray-50">
                                              <TableHead>Book</TableHead>
                                              <TableHead>Type</TableHead>
                                              <TableHead>Borrowed</TableHead>
                                              <TableHead>Due Date</TableHead>
                                              <TableHead>Returned</TableHead>
                                              <TableHead>Status</TableHead>
                                              <TableHead className="text-right">Fine</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {userTransactions.slice(0, 10).map((t) => (
                                              <TableRow key={t.id}>
                                                <TableCell className="font-medium">
                                                  {t.bookName}
                                                </TableCell>
                                                <TableCell>
                                                  <Badge
                                                    variant={
                                                      t.borrowingType === 'Group' ? 'default' : 'secondary'
                                                    }
                                                  >
                                                    {t.borrowingType}
                                                  </Badge>
                                                </TableCell>
                                                <TableCell>
                                                  {new Date(t.fromDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                  {new Date(t.dueDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                  {t.returnDate
                                                    ? new Date(t.returnDate).toLocaleDateString()
                                                    : '-'}
                                                </TableCell>
                                                <TableCell>
                                                  <Badge
                                                    variant={
                                                      t.status === 'Active'
                                                        ? 'default'
                                                        : t.status === 'Returned'
                                                        ? 'secondary'
                                                        : 'destructive'
                                                    }
                                                  >
                                                    {t.status}
                                                  </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                  {t.fine > 0 ? (
                                                    <span className="font-bold text-red-600">
                                                      ₹{t.fine}
                                                    </span>
                                                  ) : (
                                                    <span className="text-muted-foreground">₹0</span>
                                                  )}
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary Footer */}
          {filteredMembers.length > 0 && (
            <div className="flex justify-between items-center pt-4 text-sm text-muted-foreground">
              <span>
                Showing {filteredMembers.length} of {members.length} members
              </span>
              <span>
                Total Library Points: {members.reduce((sum, m) => sum + m.points, 0)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewMembers;