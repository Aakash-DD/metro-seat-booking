import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { Seat } from '../models/seat.model';

class FirestoreService {
    private db: any;

    constructor() {
        // Initialize Firestore after Firebase is ready
        this.initializeFirestore();
    }

    private async initializeFirestore() {
        try {
            this.db = firebase.firestore();
            console.log("Firestore initialized successfully");
        } catch (error) {
            console.error("Firestore initialization error:", error);
        }
    }

    async getAvailableSeats(): Promise<Seat[]> {
        try {
            if (!this.db) await this.initializeFirestore();
            
            const querySnapshot = await this.db
                .collection('seats')
                .where('status', '==', 'available')
                .get();

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Seat));
        } catch (error) {
            console.error('Error getting seats:', error);
            return [];
        }
    }

    async offerSeat(seat: Omit<Seat, 'id'>): Promise<string> {
        try {
            if (!this.db) await this.initializeFirestore();
            
            const docRef = await this.db.collection('seats').add(seat);
            return docRef.id;
        } catch (error) {
            console.error('Error offering seat:', error);
            throw error;
        }
    }

    async bookSeat(seatId: string, bookedBy: string): Promise<void> {
        try {
            if (!this.db) await this.initializeFirestore();
            
            await this.db.collection('seats').doc(seatId).update({
                status: 'booked',
                bookedBy,
                bookingTimestamp: Date.now()
            });
        } catch (error) {
            console.error('Error booking seat:', error);
            throw error;
        }
    }

    listenToAvailableSeats(callback: (seats: Seat[]) => void): () => void {
        if (!this.db) this.initializeFirestore();
        
        return this.db
            .collection('seats')
            .where('status', '==', 'available')
            .onSnapshot(snapshot => {
                const seats = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Seat));
                callback(seats);
            });
    }
}

export const firestoreService = new FirestoreService();