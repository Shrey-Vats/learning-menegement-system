// ProfileCard.tsx (using shadcn/ui)
import React from 'react';
import { MemberDetails } from '@/types/member';
import { User, Mail, Phone, Calendar, MapPin, Award } from 'lucide-react';

// Import shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ProfileCardProps {
    memberDetails: MemberDetails;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ memberDetails }) => {
    const memberId = memberDetails.userType === "Student"
        ? memberDetails.admissionId
        : memberDetails.employeeId;

    const ProfileDetail: React.FC<{ Icon: React.ElementType, label: string, value: string | number | undefined }> = ({ Icon, label, value }) => (
        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md">
            <Icon className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value || 'N/A'}</p>
            </div>
        </div>
    );
    
    const StatCard: React.FC<{ Icon: React.ElementType, title: string, value: string | number }> = ({ Icon, title, value }) => (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-primary-foreground">{value}</div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Top Info Card */}
            <Card className="p-6 border-l-4 border-primary">
                <div className="flex flex-col sm:flex-row items-center space-x-6">
                    <img
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-4 sm:mb-0"
                        src="/assets/images/Profile.png"
                        alt={memberDetails.userFullName}
                    />
                    <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">{memberDetails.userFullName}</h2>
                        <p className="text-lg font-medium text-primary">
                            {memberDetails.userType} - {memberId}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Member Since: {memberDetails.dob ? new Date(memberDetails.dob).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Details and Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Contact and General Info */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl">Personal Information</CardTitle>
                        <Separator className="mt-2" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ProfileDetail Icon={Mail} label="Email" value={memberDetails.email} />
                            <ProfileDetail Icon={Phone} label="Mobile" value={memberDetails.mobileNumber} />
                            <ProfileDetail Icon={Calendar} label="Age" value={memberDetails.age} />
                            <ProfileDetail Icon={User} label="Gender" value={memberDetails.gender} />
                            <div className="sm:col-span-2">
                                <ProfileDetail Icon={MapPin} label="Address" value={memberDetails.address} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Points and Rank */}
                <div className="lg:col-span-1 space-y-4">
                    <StatCard Icon={Award} title="Library Points" value={540} />
                    <StatCard Icon={Award} title="Current Rank" value={memberDetails.points} />
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;