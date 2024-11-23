import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { Seat } from '../../shared/models/seat.model';
import { firestoreService } from '../../shared/services/firestore.service';

export class HomeViewModel extends Observable {
    private _availableSeats: Array<Seat> = [];
    private _stations: string[] = [
        'Rajiv Chowk',
        'Kashmere Gate',
        'Central Secretariat',
        'Chandni Chowk',
        'New Delhi',
        'AIIMS'
    ];
    private _selectedStationIndex: number = 0;
    private unsubscribe: (() => void) | null = null;

    constructor() {
        super();
        this.setupRealtimeUpdates();
    }

    private setupRealtimeUpdates() {
        this.unsubscribe = firestoreService.listenToAvailableSeats(seats => {
            this.availableSeats = seats;
        });
    }

    onOfferSeat() {
        Frame.topmost().navigate('views/offer-seat/offer-seat-page');
    }

    async onBookSeat(args) {
        const seat: Seat = args.object.bindingContext;
        
        try {
            await firestoreService.bookSeat(seat.id, 'Person A');
            
            alert(
                'Booking Confirmed!\n\n' +
                `Train: ${seat.trainId}\n` +
                `Coach: ${seat.coachNumber}\n` +
                `Seat: ${seat.seatNumber} (${seat.side} side)\n` +
                `Station: ${seat.station}`
            );
        } catch (error) {
            alert('Failed to book seat. Please try again.');
        }
    }

    get availableSeats(): Array<Seat> {
        return this._availableSeats;
    }

    set availableSeats(value: Array<Seat>) {
        if (this._availableSeats !== value) {
            this._availableSeats = value;
            this.notifyPropertyChange('availableSeats', value);
        }
    }

    get stations(): string[] {
        return this._stations;
    }

    get selectedStationIndex(): number {
        return this._selectedStationIndex;
    }

    set selectedStationIndex(value: number) {
        if (this._selectedStationIndex !== value) {
            this._selectedStationIndex = value;
            this.notifyPropertyChange('selectedStationIndex', value);
        }
    }
}