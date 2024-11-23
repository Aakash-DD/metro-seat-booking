import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { Seat } from '../../shared/models/seat.model';
import { firestoreService } from '../../shared/services/firestore.service';

interface SeatItem {
    seatNumber: number;
    isSelected: boolean;
    col: number;
    row: number;
}

export class OfferSeatViewModel extends Observable {
    private _trainId: string = '';
    private _coachNumbers = Array.from({length: 8}, (_, i) => `Coach ${i + 1}`);
    private _selectedCoachIndex: number = 0;
    private _stations: string[] = [
        'Rajiv Chowk',
        'Kashmere Gate',
        'Central Secretariat',
        'Chandni Chowk',
        'New Delhi',
        'AIIMS'
    ];
    private _selectedStationIndex: number = 0;
    private _seatLayout: SeatItem[] = [];
    private _seatLayoutBottom: SeatItem[] = [];
    private _selectedSeatNumber: number = 0;
    private _seatLayoutColumns: string = '';

    constructor() {
        super();
        this.initializeSeatLayout();
    }

    private initializeSeatLayout() {
        // Create top row seats (20 seats)
        this._seatLayout = Array.from({length: 20}, (_, i) => ({
            seatNumber: i + 1,
            isSelected: false,
            col: i,
            row: 0
        }));

        // Create bottom row seats (20 seats)
        this._seatLayoutBottom = Array.from({length: 20}, (_, i) => ({
            seatNumber: i + 21,
            isSelected: false,
            col: i,
            row: 1
        }));

        // Generate columns string for GridLayout
        this._seatLayoutColumns = Array(20).fill('auto').join(', ');
        
        this.notifyPropertyChange('seatLayout', this._seatLayout);
        this.notifyPropertyChange('seatLayoutBottom', this._seatLayoutBottom);
        this.notifyPropertyChange('seatLayoutColumns', this._seatLayoutColumns);
    }

    onSeatTap(args) {
        const seat = args.object.bindingContext;
        
        // Deselect all seats
        this._seatLayout.forEach(s => s.isSelected = false);
        this._seatLayoutBottom.forEach(s => s.isSelected = false);
        
        // Select the tapped seat
        if (seat.row === 0) {
            this._seatLayout[seat.col].isSelected = true;
        } else {
            this._seatLayoutBottom[seat.col].isSelected = true;
        }
        
        this._selectedSeatNumber = seat.seatNumber;
        
        this.notifyPropertyChange('seatLayout', this._seatLayout);
        this.notifyPropertyChange('seatLayoutBottom', this._seatLayoutBottom);
        this.notifyPropertyChange('selectedSeatNumber', this._selectedSeatNumber);
        this.notifyPropertyChange('selectedSeatInfo', this.selectedSeatInfo);
    }

    get selectedSeatInfo(): string {
        if (!this._selectedSeatNumber) return 'No seat selected';
        const row = this._selectedSeatNumber > 20 ? 'Bottom' : 'Top';
        return `Seat ${this._selectedSeatNumber} (${row} Row)`;
    }

    get seatLayoutColumns(): string {
        return this._seatLayoutColumns;
    }

    get seatLayout(): SeatItem[] {
        return this._seatLayout;
    }

    get seatLayoutBottom(): SeatItem[] {
        return this._seatLayoutBottom;
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

    get trainId(): string {
        return this._trainId;
    }

    set trainId(value: string) {
        if (this._trainId !== value) {
            this._trainId = value;
            this.notifyPropertyChange('trainId', value);
        }
    }

    get coachNumbers(): string[] {
        return this._coachNumbers;
    }

    get selectedCoachIndex(): number {
        return this._selectedCoachIndex;
    }

    set selectedCoachIndex(value: number) {
        if (this._selectedCoachIndex !== value) {
            this._selectedCoachIndex = value;
            this.notifyPropertyChange('selectedCoachIndex', value);
        }
    }

    async onOfferSeat() {
        if (!this.validateInput()) {
            alert('Please fill all fields correctly');
            return;
        }

        const seat: Omit<Seat, 'id'> = {
            trainId: this.trainId,
            coachNumber: this._selectedCoachIndex + 1,
            seatNumber: this._selectedSeatNumber,
            side: this._selectedSeatNumber > 20 ? 'bottom' : 'top',
            status: 'available',
            station: this._stations[this._selectedStationIndex],
            offeredBy: 'Person B',
            timestamp: Date.now()
        };

        try {
            await firestoreService.offerSeat(seat);
            alert('Seat offered successfully!');
            Frame.topmost().navigate({
                moduleName: 'views/home/home-page',
                clearHistory: true
            });
        } catch (error) {
            alert('Failed to offer seat. Please try again.');
        }
    }

    private validateInput(): boolean {
        return (
            this.trainId.length > 0 &&
            this._selectedSeatNumber > 0
        );
    }
}