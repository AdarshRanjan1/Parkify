import { Body, Controller, Post, Patch } from '@nestjs/common';
import { ParkingService } from './parking.service';

// controllers will handle the api routes
@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post('init')
  initializeParking(@Body('totalSlots') totalSlots: number) {
    console.log('Received slots:', totalSlots); // This console will check if the array is getting initialized or not
    return this.parkingService.initializeParking(totalSlots);
  }

  @Patch('lot')
  addSlots(@Body('increment_slot') incrementSlot: number) {
    return this.parkingService.addSlots(incrementSlot);
  }
  
}