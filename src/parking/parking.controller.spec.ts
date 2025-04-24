import { Test, TestingModule } from '@nestjs/testing';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';

describe('ParkingController', () => {
  let controller: ParkingController;

  const mockParkingService = {
    initializeParking: jest.fn(),
    addSlots: jest.fn(),
    parkVehicle: jest.fn(),
    getRegistrationNumbersByColor: jest.fn(),
    getSlotNumbersByColor: jest.fn(),
    getSlotNumbersByRegistration: jest.fn(),
    clearSlot: jest.fn(),
    getStatus: jest.fn(),
    countCarsByColor: jest.fn(),
    resetParkingLot: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingController],
      providers: [
        {
          provide: ParkingService,
          useValue: mockParkingService,
        },
      ],
    }).compile();

    controller = module.get<ParkingController>(ParkingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
