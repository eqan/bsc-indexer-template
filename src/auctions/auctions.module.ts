import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsResolver } from './auctions.resolver';
import { Auction } from './entities/auction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Auction])],
  providers: [AuctionsResolver, AuctionsService],
})
export class AuctionsModule {}
