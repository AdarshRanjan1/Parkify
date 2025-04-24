import { Injectable, BadRequestException } from '@nestjs/common';
import MinHeap  from 'heap-js'; 
// I will use min heap becaue that will optimize 
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
    // Check for missing or invalid totalSlots
    if (!totalSlots || totalSlots <= 0) {
      throw new BadRequestException('Invalid totalSlots. Please provide a positive number greater than zero.');
    }

    // Now we will initialize because number is positive
    this.parkingSlots = Array(totalSlots).fill(null);
    this.availableSlots = new MinHeap<number>();
    for (let i = 1; i <= totalSlots; i++) {
      this.availableSlots.push(i);
    }
    return { message: `Parking lot initialized with ${totalSlots} slots.` };
  }
  
  // This is for increasing the size of the parking lot if necessary
  addSlots(incrementSlot: number) {
    if (this.parkingSlots.length === 0) {
      throw new BadRequestException(
        'Parking lot not initialized yet. Please initialize first using /init.',
      );
    }

    if (
      incrementSlot === undefined ||
      isNaN(incrementSlot) ||
      incrementSlot <= 0
    ) {
      throw new BadRequestException(
        'Invalid incrementSlot. Please provide a positive number greater than zero.',
      );
    }
  

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
    if (!vehicle_number || !color) {
      throw new BadRequestException('Both vehicle_number and color are required.');
    }
  
    if (this.availableSlots.size() === 0) {
      return { message: 'No available slots' };
    }
  
    // Check if vehicle_number already exists (duplicate vehicle prevention)
    for (const vehicle of this.occupiedSlots.values()) {
      if (vehicle.vehicle_number === vehicle_number) {
        throw new BadRequestException(`Vehicle with number ${vehicle_number} is already parked.`);
      }
    }
  
    const slotNumber = this.availableSlots.pop();
  
    if (slotNumber === undefined) {
      return { message: 'Error: No slot returned from heap.' };
    }
  
    this.occupiedSlots.set(slotNumber, { vehicle_number, color });
  
    return {
      message: 'Vehicle parked successfully',
      slot_number: slotNumber,
    };
  }


  //method to get reg nos of a particular color car
  getRegistrationNumbersByColor(color: string): string[] | { message: string } {
    const matchingCars: string[] = [];
    for (const { vehicle_number, color: carColor } of this.occupiedSlots.values()) {
      if (carColor.toLowerCase() === color.toLowerCase()) {
        matchingCars.push(vehicle_number);
      }
    }

    if(matchingCars.length === 0){
      return { message: `There are no registration numbers with this ${color} color car.`};
    }

    return matchingCars;
  }

  //fetch slot number according to reg no method
  getSlotNumbersByRegistration(registration_no: string): number[] | { message: string } {
    const matchingSlots: number[] = [];
  
    for (const [slot, { vehicle_number }] of this.occupiedSlots.entries()) {
      if (vehicle_number === registration_no) {
        matchingSlots.push(slot);
      }
    }
  
    if (matchingSlots.length === 0) {
      return { message: `No car found with registration number ${registration_no}` };
    }
  
    return matchingSlots;
  }

  // this method will give all the slot numbers of the car of a specific color
  getSlotNumbersByColor(color: string): number[] | { message: string } {
    const matchingSlots: number[] = [];
    for (const [slot, { color: carColor }] of this.occupiedSlots.entries()) {
      if (carColor.toLowerCase() === color.toLowerCase()) {
        matchingSlots.push(slot);
      }
    }

    if(matchingSlots.length == 0){
      return { message: `There are no cars with color ${color}.` };
    }  

    return matchingSlots;
  }


  // method to clear the slot using either slot number or the registration number
  clearSlot(data: { slot_number?: number; car_registration_no?: string }) {
    if (!data || (data.slot_number === undefined && !data.car_registration_no)) {
      return { message: 'Invalid input. Provide either slot_number or car_registration_no.' };
    }


    if (data.slot_number !== undefined) {
      const { slot_number } = data;
      const vehicle = this.occupiedSlots.get(slot_number);

    if (!vehicle) {
      return { message: `Slot ${slot_number} is already free or does not exist.` };
    }

      console.log(`Clearing slot ${slot_number}:`, vehicle);
      this.occupiedSlots.delete(slot_number);
      this.availableSlots.push(slot_number);
      return { freed_slot_number: slot_number };
    }
  
    if (data.car_registration_no) {
      for (const [slot, vehicle] of this.occupiedSlots.entries()) {
        if (vehicle.vehicle_number === data.car_registration_no) {
          this.occupiedSlots.delete(slot);
          this.availableSlots.push(slot);
          return { freed_slot_number: slot };
        }
      }
      return { message: `Car with registration number ${data.car_registration_no} not found.` };
    }
  
    return { message: 'Invalid input. Provide either slot_number or car_registration_no.' };
  }


  // get status method (fetchs all the occupied slots with the car details)
  getStatus(): { slot_no: number; registration_no: string; color: string }[] | { message: string } {
    const status: { slot_no: number; registration_no: string; color: string }[] = [];
  
    for (const [slot, { vehicle_number, color }] of this.occupiedSlots.entries()) {
      status.push({
        slot_no: slot,
        registration_no: vehicle_number,
        color: color
      });
    }

    if(status.length === 0){
      return { message: `The parking lot is empty.`};
    }
  
    return status;
  }


  // Extra feature - count cars by color
  countCarsByColor(color: string): { color: string; count: number } {
    let count = 0;
  
    for (const { color: carColor } of this.occupiedSlots.values()) {
      if (carColor.toLowerCase() === color.toLowerCase()) {
        count++;
      }
    }
  
    return { color, count };
  }


  // Extra feature - reset the whole parking lot
  resetParkingLot(): { message: string } {
    const totalSlots = this.parkingSlots.length;
  
    // Reset data structures
    this.occupiedSlots.clear();
    this.availableSlots = new MinHeap<number>();
    
    // Refill MinHeap with all slots
    for (let i = 1; i <= totalSlots; i++) {
      this.availableSlots.push(i);
    }
  
    return { message: 'Parking lot has been reset. All slots are now available.' };
  }
}