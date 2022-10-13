import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Like, Repository } from 'typeorm';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { GetAllCollections } from './dto/get-all-collections.dto';
import { UpdateCollectionsInput } from './dto/update-collections.input';
import {FilterDto} from "./dto/filter.dto";
import { Collections } from './entities/collections.entity';
import { retry, skip } from 'rxjs';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collections)
    private collectionsRepo: Repository<Collections>,
  ) {}

  /**
   * Create Collection in Database
   * @param createCollectionsInput
   * @returns  Created Collection
   */
  async createCollection(
    createCollectionsInput: CreateCollectionsInput,
  ): Promise<Collections> {
    try {
      const collection = this.collectionsRepo.create(createCollectionsInput);

      return await this.collectionsRepo.save(collection);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Collections ... With Filters
   * @@params No Params
   * @returns Array of Collections and Total Number of Collections
   */
  async findAllCollections(filterDto:FilterDto): Promise<GetAllCollections> {
    try {
      if(filterDto.collectionId && !filterDto.name){
        const items=await this.collectionsRepo.findBy({collectionId: filterDto.collectionId})
        const total = await this.collectionsRepo.count();

        return {items,total}
      }
      if(filterDto.name && !filterDto.collectionId){
        let items=await this.collectionsRepo.findBy({name:ILike(`%${filterDto.name}%`)})
        const total = await this.collectionsRepo.count();

        return {items,total}

      }
      let items = await this.collectionsRepo.find({ where:
        {
          collectionId: filterDto.collectionId,
         name:  ILike(`%${filterDto.name}%`)},
         
        take: Number(filterDto.limit) || 10,
        skip: Number(filterDto.page) || 0,
        },
        )

        
      const total = await this.collectionsRepo.count();
      
      if (!items) {
        throw new NotFoundException('No Collections Found');
      }
      return { items, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * GET Collection By Id
   * @param id
   * @returns Collection against Provided Id
   */
  async getCollectionById(collectionId: string): Promise<Collections> {
    try {
      const found = await this.collectionsRepo.findOneByOrFail({
        collectionId,
      });
      if (!found) {
        throw new NotFoundException(
          `Collection against ${collectionId}} not found`,
        );
      }
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Collections Atributes
   * @param updateCollectionsInput
   * @returns
   */
  async updateCollectionAttribute(
    updateCollectionsInput: UpdateCollectionsInput,
  ): Promise<Collections> {
    try {
      const { collectionId, ...rest } = updateCollectionsInput;
      await this.collectionsRepo.update({ collectionId }, rest);
      return this.getCollectionById(collectionId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * DEETE Collection
   * @param collectionId
   * @returns Message that collection succesfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      const promises = [];
      ids.map((id) => {
        promises.push(this.collectionsRepo.delete(id));
      });
      await Promise.resolve(promises);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  

}
