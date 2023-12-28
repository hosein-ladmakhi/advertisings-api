import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as path from 'path';

@Injectable()
export class LocationsService {
  getCities() {
    return readFileSync(
      path.join(__dirname, '..', '..', 'cities.json'),
      'utf-8',
    );
  }
}
