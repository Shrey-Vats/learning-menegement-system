// src/data/reservationData.ts

export type Reservation = {
  id: number;
  userName: string;
  bookTitle: string;
  reservationDate: string; // ISO date string
};

export const reservations: Reservation[] = [
  { id: 101, userName: 'Pranav', bookTitle: 'Rich Dad Poor Dad', reservationDate: '2025-07-12' },
  { id: 102, userName: 'Sashank', bookTitle: 'The Subtle Art of Not Giving a F*ck', reservationDate: '2025-07-10' },
  { id: 103, userName: 'Tanishq', bookTitle: 'Wings Of Fire', reservationDate: '2025-09-15' },
  { id: 104, userName: 'Akhil', bookTitle: 'The Secret', reservationDate: '2025-09-02' },
  { id: 105, userName: 'Surya', bookTitle: 'Bad Guys', reservationDate: '2025-07-21' },
  { id: 106, userName: 'Dinesh', bookTitle: 'Giovanni Rovelli', reservationDate: '2025-07-02' },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export { formatDate };