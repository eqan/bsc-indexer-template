import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateAuctionInput } from './dto/create-auction.input';
import { GetAllAuctions } from './dto/get-all-auctions.dto';
import { UpdateAuctionInput } from './dto/update-auction.input';
import { Auction } from './entities/auction.entity';
import { FilterAuctionDto } from './dto/filter.dto';
@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepo: Repository<Auction>,
  ) {}
  /**
   * Create Auction
   * @param createAuctionInput
   * @returns Created Auction
   */
  async create(createAuctionInput: CreateAuctionInput): Promise<Auction> {
    try {
      const auction = this.auctionRepo.create(createAuctionInput);
      return await this.auctionRepo.save(createAuctionInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * GEt All Auction
   * @param filterDto
   * @returns All Auctions or Searched by ID or contract
   */
  async index(filterDto: FilterAuctionDto): Promise<GetAllAuctions> {
    try {
      const { page, limit, ...rest } = filterDto;
      const [items, total] = await Promise.all([
        this.auctionRepo.find({
          where: {
            auctionId: rest?.auctionId,
            contract: rest?.contract,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.auctionRepo.count({
          where: {
            auctionId: rest.auctionId,
            contract: rest?.contract,
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Auction by ID
   * @param auctionId
   * @returns  Auction against provided ID
   */
  async show(auctionId: number): Promise<Auction> {
    try {
      const found = await this.auctionRepo.findOneByOrFail({
        auctionId,
      });
      if (!found) {
        throw new NotFoundException(`Auction against ${auctionId}} not found`);
      }
      return found;
    } catch (error) {}
  }

  /**
   * Update Auction satatus
   * @param updateAuctionInput
   * @returns Updated Suction
   */
  async update(updateAuctionInput: UpdateAuctionInput): Promise<Auction> {
    try {
      const { auctionId, ...rest } = updateAuctionInput;
      await this.auctionRepo.update({ auctionId }, rest);
      return this.show(auctionId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete Auction
   * @param deleteWithIds
   * @returns nothing
   */
  async delete(deleteWithIds: { id: number[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.auctionRepo.delete({ auctionId: In(ids) });
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
