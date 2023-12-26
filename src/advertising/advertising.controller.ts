import { Controller, Get, Inject } from '@nestjs/common';
import { AdvertisingService } from './advertising.service';

@Controller('advertising')
export class AdvertisingController {
  @Inject() private readonly advertisingService: AdvertisingService;

  @Get()
  getAdvertisings() {
    return this.advertisingService.findAllAdvertisings();
  }
}
