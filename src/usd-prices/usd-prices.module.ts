import { Module } from '@nestjs/common';
import { UsdPricesService } from './usd-prices.service';
import { UsdPricesResolver } from './usd-prices.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsdPrice } from './entities/usd-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsdPrice])],
  providers: [UsdPricesResolver, UsdPricesService],
  exports: [UsdPricesService],
})
export class UsdPricesModule {}
