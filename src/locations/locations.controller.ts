import { Controller, Get, Inject } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  @Inject(LocationsService) private readonly locationsService: LocationsService;

  @Get('cities')
  getCities() {
    return this.locationsService.getCities();
  }
}
