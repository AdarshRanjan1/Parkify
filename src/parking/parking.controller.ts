import { Body, Controller, Post, Patch, Get, Param } from '@nestjs/common';
import { ParkingService } from './parking.service';

// controllers will handle the api routes
@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  // Router for the initial setting of the total slots
  @Post('init')
  initializeParking(@Body('totalSlots') totalSlots: number) {
    console.log('Received slots:', totalSlots); // This console will check if the array is getting initialized or not
    return this.parkingService.initializeParking(totalSlots);
  }

  // For the increment of slots
  @Patch('lot')
  addSlots(@Body('increment_slot') incrementSlot: number) {
    return this.parkingService.addSlots(incrementSlot);
  }
  

  // For allocating the slots
  @Post('park')
  parkVehicle(
    @Body('vehicle_number') vehicleNumber: string,
    @Body('color') color: string,
  ) {
    return this.parkingService.parkVehicle(vehicleNumber, color);
  }

  
  // get method for regno of particular car color
  @Get('/registration_numbers/:color')
  getRegistrationNumbersByColor(@Param('color') color: string) {
    return this.parkingService.getRegistrationNumbersByColor(color);
  }


  // get method to get slot nos of specific colored car
  @Get('slot_numbers/:color')
  getSlotNumbers(@Param('color') color: string) {
    return this.parkingService.getSlotNumbersByColor(color);
  }

  // clear method 
  @Post('clear')
  clearSlot(@Body() body: { slot_number?: number; car_registration_no?: string }) {
    return this.parkingService.clearSlot(body);
  }
}