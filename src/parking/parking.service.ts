import { Injectable } from '@nestjs/common';

//Injectable is used to mark the class as a service that can be use elsewhere
@Injectable()
export class ParkingService {
  private parkingSlots: (string | null)[] = [];

  // This one is for initializing the size of the parking lot in the beginning
  initializeParking(totalSlots: number) {
    this.parkingSlots = Array(totalSlots).fill(null);
    return { message: `Parking lot initialized with ${totalSlots} slots.` };
  }
  
  // This is for increasing the size of the parking lot if necessary
  addSlots(incrementSlot: number) {
    this.parkingSlots.push(...Array(incrementSlot).fill(null));
    console.log('Total slots after incrementing:', this.parkingSlots.length);
    return { total_slot: this.parkingSlots.length };
  }

  getSlots() {
    return this.parkingSlots;
  }
}