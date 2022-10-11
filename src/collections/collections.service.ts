import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { DeleteCollectionsInput } from './dto/delete-collectionss.input';
import { UpdateCollectionsInput } from './dto/update-collections.input';
import { Collections } from './entities/collections.entity';

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
      const collection: Collections = await this.collectionsRepo.create(
        createCollectionsInput,
      );

      return collection;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Collections
   * @@params No Params
   * @returns Array of Collections and Total Number of Collections
   */
  async findAllCollections(): Promise<{
    items: Collections[];
    total: number;
  }> {
    try {
      const items = await this.collectionsRepo.find();
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
      ids.map(async (id) => {
        const found = await this.collectionsRepo.delete(id);
        if (!found) {
          throw new NotFoundException('Collection not found');
        }
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
