import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from './parking.service';
import { BadRequestException } from '@nestjs/common';

// Start of test suite
describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingService],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
  });

  // ✅ Test case 1 - Initialization with valid value
  it('should initialize parking lot with valid slots', () => {
    const response = service.initializeParking(5);
    expect(response).toEqual({ message: 'Parking lot initialized with 5 slots.' });
  });

  // ❌ Test case 2 - Initialization with invalid slots (0)
  it('should throw error if initialized with 0 slots', () => {
    expect(() => service.initializeParking(0)).toThrow(BadRequestException);
  });

  // ✅ Test case 3 - Add slots
  it('should add slots to the parking lot', () => {
    service.initializeParking(2);
    const result = service.addSlots(3);
    expect(result.total_slot).toBe(5);
  });

  // ❌ Test case 4 - Add slots with invalid input
  it('should throw error when adding invalid slot count', () => {
    service.initializeParking(2);
    expect(() => service.addSlots(-1)).toThrow(BadRequestException);
  });

  // ✅ Test case 5 - Park a vehicle
  it('should park a vehicle successfully', () => {
    service.initializeParking(1);
    const result = service.parkVehicle('KA-01-HH-1234', 'Red');
    expect(result.message).toBe('Vehicle parked successfully');
    expect(result.slot_number).toBe(1);
  });

  // ❌ Test case 6 - Park vehicle with no available slots
  it('should return message if no slots available', () => {
    service.initializeParking(1);
    service.parkVehicle('KA-01-HH-1234', 'Red');
    const result = service.parkVehicle('KA-01-HH-5678', 'Blue');
    expect(result).toEqual({ message: 'No available slots' });
  });

  // ❌ Test case 7 - Park with missing vehicle number or color
  it('should throw error if vehicle number or color is missing', () => {
    service.initializeParking(1);
    // @ts-ignore
    expect(() => service.parkVehicle(undefined, 'Red')).toThrow(BadRequestException);
    // @ts-ignore
    expect(() => service.parkVehicle('KA-01-HH-1234', undefined)).toThrow(BadRequestException);
  });

  // ✅ Test case 8 - Reset the lot
  it('should reset the parking lot', () => {
    service.initializeParking(2);
    service.parkVehicle('KA-01-HH-1234', 'Red');
    const reset = service.resetParkingLot();
    expect(reset.message).toBe('Parking lot has been reset. All slots are now available.');
    expect(service.getStatus()).toEqual({ message: 'The parking lot is empty.' });
  });

  // ✅ Test case 9 - getRegistrationNumbersByColor
  it('should get registration numbers by color', () => {
    service.initializeParking(2);
    service.parkVehicle('KA-01-HH-1234', 'Red');
    expect(service.getRegistrationNumbersByColor('Red')).toEqual(['KA-01-HH-1234']);
  });

  // ✅ Test case 10 - getSlotNumbersByColor
  it('should get slot numbers by color', () => {
    service.initializeParking(1);
    service.parkVehicle('KA-01-HH-5678', 'Blue');
    expect(service.getSlotNumbersByColor('Blue')).toEqual([1]);
  });

  // ✅ Test case 11 - getSlotNumbersByRegistration
  it('should get slot number(s) by registration number', () => {
    service.initializeParking(1);
    service.parkVehicle('KA-02-XY-9999', 'Black');
    expect(service.getSlotNumbersByRegistration('KA-02-XY-9999')).toEqual([1]);
  });

  // ✅ Test case 12 - countCarsByColor
  it('should count cars by color', () => {
    service.initializeParking(2);
    service.parkVehicle('KA-03-ZZ-0001', 'Red');
    service.parkVehicle('KA-03-ZZ-0002', 'Red');
    expect(service.countCarsByColor('Red')).toEqual({ color: 'Red', count: 2 });
  });

  // ✅ Test case 13 - getStatus when cars are parked
  it('should get current status of parked vehicles', () => {
    service.initializeParking(1);
    service.parkVehicle('KA-05-AA-1111', 'Green');
    const result = service.getStatus();
    expect(result).toEqual([
      { slot_no: 1, registration_no: 'KA-05-AA-1111', color: 'Green' },
    ]);
  });

  // ✅ Test case 14 - clearSlot using slot number
  it('should clear a slot using slot number', () => {
    service.initializeParking(1);
    service.parkVehicle('KA-06-BB-2222', 'Black');
    const result = service.clearSlot({ slot_number: 1 });
    expect(result).toEqual({ freed_slot_number: 1 });
  });

  // ✅ Test case 15 - clearSlot using registration number
  it('should clear a slot using registration number', () => {
    service.initializeParking(1);
    service.parkVehicle('KA-07-CC-3333', 'White');
    const result = service.clearSlot({ car_registration_no: 'KA-07-CC-3333' });
    expect(result).toEqual({ freed_slot_number: 1 });
  });

  // ✅ Test case 16 - clearSlot with no data
  it('should return error message for invalid clearSlot input', () => {
    service.initializeParking(1);
    const result = service.clearSlot({});
    expect(result).toEqual({ message: 'Invalid input. Provide either slot_number or car_registration_no.' });
  });
});
