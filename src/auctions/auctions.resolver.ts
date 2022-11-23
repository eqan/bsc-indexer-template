import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuctionsService } from './auctions.service';
import { Auction } from './entities/auction.entity';
import { CreateAuctionInput } from './dto/create-auction.input';
import { UpdateAuctionInput } from './dto/update-auction.input';
import BaseProvider from 'src/core/base.BaseProvider';
import { FilterAuctionDto } from './dto/filter-auctions.dto';
import { BadRequestException } from '@nestjs/common';
import { GetAllAuctions } from './dto/get-all-auctions.dto';
import { DeleteAuctionsInput } from './dto/delete.auction.input';

@Resolver(() => Auction)
export class AuctionsResolver extends BaseProvider<Auction | FilterAuctionDto> {
  constructor(private readonly auctionsService: AuctionsService) {
    super();
  }

  /**
   * Create Auction
   * @param createAuctionInput
   * @returns Created Auction
   */
  @Mutation(() => Auction, { name: 'CreateAuction' })
  async create(
    @Args('createAuctionInput') createAuctionInput: CreateAuctionInput,
  ): Promise<Auction> {
    try {
      return this.auctionsService.create(createAuctionInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All or Searched Auctions
   * @param filterAuctionDto
   * @returns Filtered Auction
   */
  @Query(() => GetAllAuctions, { name: 'GetAllAuctions' })
  async index(
    @Args('GetAllAuctions') filterAuctionDto: FilterAuctionDto,
  ): Promise<GetAllAuctions> {
    try {
      return await this.auctionsService.index(filterAuctionDto);
    } catch (error) {}
  }

  /**
   * Get Auction by Id
   * @param auctionId
   * @returns Auction against corresponding ID
   */
  @Query(() => Auction, { name: 'GetAuctionById' })
  async show(@Args('GetAuctionById') auctionId: number): Promise<Auction> {
    try {
      return await this.auctionsService.show(auctionId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Auction status
   * @param updateAuctionInput
   * @returns Updated auction
   */
  @Mutation(() => Auction, { name: 'UpdateAuctionStatus' })
  async edit(
    @Args('UpdateAuctionStatus') updateAuctionInput: UpdateAuctionInput,
  ): Promise<Auction> {
    try {
      return this.auctionsService.update(updateAuctionInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete Auction
   * @param deleteAuctionsInput
   */
  @Mutation(() => Auction, { nullable: true, name: 'DeleteAuction' })
  async delete(
    @Args({
      name: 'DeleteAuctionInout',
    })
    deleteAuctionsInput: DeleteAuctionsInput,
  ): Promise<void> {
    try {
      await this.auctionsService.delete(deleteAuctionsInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
