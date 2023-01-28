import { Module } from '@nestjs/common';
import { PriceUpdateService } from './priceUpdate.service';

@Module({
  providers: [PriceUpdateService],
  exports: [PriceUpdateService],
})
export class PriceUpdateModule {}
