import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AdvertisingService } from './advertising.service';

@Controller('advertising')
export class AdvertisingController {
  @Inject() private readonly advertisingService: AdvertisingService;

  @Get()
  getAdvertisings() {
    return this.advertisingService.findAllAdvertisings();
  }

  @Get(':id')
  getAdvertisingById(@Param('id') id: string) {
    return this.advertisingService.findAdvertisingById(id);
  }
}
