import { Hourglass } from 'lucide-react';
import { reservations, formatDate, Reservation } from '@/data/reservationData';

// --- IMPORTANT ---
// Assumed imports for Shadcn Table components. These must exist in your project:
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; 
// Note: Shadcn components handle the base Tailwind styling (border, hover, etc.)

export const ReservedBooks = () => {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12'>
      
      {/* Title */}
      <h2 className='text-3xl font-bold tracking-tight text-gray-900 border-b-2 border-red-600 pb-2 mb-8 flex items-center'>
        <Hourglass className="h-6 w-6 mr-2 text-red-600" />
        Books On Hold
      </h2>

      {/* Shadcn Table Component */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          
          {/* Table Header */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] font-semibold text-gray-700">Reserver Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Book Title</TableHead>
              <TableHead className="font-semibold text-gray-700">Reservation Date</TableHead>
            </TableRow>
          </TableHeader>
          
          {/* Table Body */}
          <TableBody>
            {reservations.map((item: Reservation) => (
              // Shadcn TableRow automatically includes the hover effect and border
              <TableRow key={item.id} className="hover:bg-red-50/50">
                <TableCell className="font-medium text-gray-900">
                  {item.userName}
                </TableCell>
                <TableCell className="text-gray-700">
                  {item.bookTitle}
                </TableCell>
                <TableCell className="text-gray-500">
                  {formatDate(item.reservationDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};