import { Injectable } from '@nestjs/common';

//Injectable is used to mark the class as a service that can be use elsewhere
@Injectable()
export class ParkingService {
  private parkingSlots: (string | null)[] = [];

  initializeParking(totalSlots: number) {
    this.parkingSlots = Array(totalSlots).fill(null);
    return { message: `Parking lot initialized with ${totalSlots} slots.` };
  }

  getSlots() {
    return this.parkingSlots;
  }
}