import { Injectable } from '@nestjs/common';
import MinHeap  from 'heap-js'; 
// I will use min heap to optimize 
// the time complexity of finding the first 
// free slot doing a linear search would take O(n) time but with
// min heap it will just take O(log n)

//Injectable is used to mark the class as a service that can be use elsewhere
@Injectable()
export class ParkingService {
  private parkingSlots: (string | null)[] = []; //Stores the no of slots
  private availableSlots = new MinHeap<number>(); // Stores available no of slots
  private occupiedSlots = new Map<number, { vehicle_number: string; color: string }>(); // Stores occupied no of slots


  // This one is for initializing the size of the parking lot in the beginning
  initializeParking(totalSlots: number) {
    this.parkingSlots = Array(totalSlots).fill(null);
    this.availableSlots = new MinHeap<number>();
    for (let i = 1; i <= totalSlots; i++) {
      this.availableSlots.push(i);
    }
    return { message: `Parking lot initialized with ${totalSlots} slots.` };
  }
  
  // This is for increasing the size of the parking lot if necessary
  addSlots(incrementSlot: number) {
    const currentTotal = this.parkingSlots.length; // Existing total
    const newSlots = Array(incrementSlot).fill(null);
    this.parkingSlots.push(...newSlots);
  
    // Push new slot indices into the MinHeap (1-based indexing)
    for (let i = currentTotal + 1; i <= this.parkingSlots.length; i++) {
      this.availableSlots.push(i);
    }
  
    console.log('Total slots after incrementing:', this.parkingSlots.length);
    return { total_slot: this.parkingSlots.length };
  }

  getSlots() {
    return this.parkingSlots;
  }

  // This endpoint is used for checking if slot is available or not and then appointing the slot 
  parkVehicle(vehicle_number: string, color: string) {
    if (this.availableSlots.size() === 0) {
      return { message: 'No available slots' };
    }
  
    const slotNumber = this.availableSlots.pop();
  
    if (slotNumber === undefined) {
      return { message: 'Error: No slot returned from heap.' };
    }
  
    // Store both vehicle number and color
    this.occupiedSlots.set(slotNumber, { vehicle_number, color });
  
    return {
      message: 'Vehicle parked successfully',
      slot_number: slotNumber,
    };
  }


  //method to get reg nos of a particular color car
  getRegistrationNumbersByColor(color: string): string[] {
    const matchingCars: string[] = [];
    for (const { vehicle_number, color: carColor } of this.occupiedSlots.values()) {
      if (carColor.toLowerCase() === color.toLowerCase()) {
        matchingCars.push(vehicle_number);
      }
    }
    return matchingCars;
  }

  // this method will give all the slot numbers of the car of a specific color
  getSlotNumbersByColor(color: string): number[] {
    const matchingSlots: number[] = [];
    for (const [slot, { color: carColor }] of this.occupiedSlots.entries()) {
      if (carColor.toLowerCase() === color.toLowerCase()) {
        matchingSlots.push(slot);
      }
    }
    return matchingSlots;
  }
}