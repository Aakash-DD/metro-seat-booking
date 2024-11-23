export interface Seat {
    id: string;
    trainId: string;
    coachNumber: number;
    seatNumber: number;
    side: 'left' | 'right';
    status: 'available' | 'booked';
    station: string;
    offeredBy: string;
    bookedBy?: string;
    timestamp: number;
}