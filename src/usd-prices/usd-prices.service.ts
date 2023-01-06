import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUsdPriceInput } from './dto/create-usd-price.input';
import { FilterUsdPriceInput } from './dto/filter-usd-price.input';
import { UsdPrice } from './entities/usd-price.entity';

@Injectable()
export class UsdPricesService {
  constructor(
    @InjectRepository(UsdPrice)
    private usdPriceRepo: Repository<UsdPrice>,
  ) {}

  /**
   * Create UsdPrice in DB
   * @params CreateUsdPriceInput
   * @returns Created UsdPrice
   */
  async create(createUsdPriceInput: CreateUsdPriceInput): Promise<UsdPrice> {
    try {
      const UsdPrice = this.usdPriceRepo.create(createUsdPriceInput);
      return await this.usdPriceRepo.save(UsdPrice);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All UsdPrices ... With Filters
   * @@params No Params
   * @returns Array of UsdPrices and Total Number of UsdPrices
   */
  async index(): Promise<UsdPrice[]> {
    try {
      const result = await this.usdPriceRepo.find({});
      return result;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * GET UsdPrice By Id
   * @param id
   * @returns UsdPrice against Provided Id
   */
  async show(filterUsdPriceInput: FilterUsdPriceInput): Promise<UsdPrice> {
    try {
      const found = await this.usdPriceRepo.findOne({
        where: {
          timestamp: filterUsdPriceInput.timestamp,
          currency: filterUsdPriceInput.currency,
        },
      });
      if (!found) {
        throw new NotFoundException(
          `UsdPrice against ${filterUsdPriceInput.currency} not found`,
        );
      }
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Edit UsdPrice
   * @param UsdPriceId
   * @returns Updated UsdPrice
   */
  edit(id: string) {
    return `This action updates a #${id} UsdPrice`;
  }

  /**
   * DEETE UsdPrice
   * @param UsdPriceIds
   * @returns
   */
  async delete(id: string): Promise<void> {
    try {
      const values = await this.usdPriceRepo.delete({ id });
      if (!values) {
        throw new NotFoundException('UsdPrice not found');
      }
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
