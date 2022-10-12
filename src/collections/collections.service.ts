import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { GetAllCollections } from './dto/get-all-collections.dto';
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
      const collection = this.collectionsRepo.create(createCollectionsInput);
      return await this.collectionsRepo.save(collection);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Collections
   * @@params No Params
   * @returns Array of Collections and Total Number of Collections
   */
  async findAllCollections(): Promise<GetAllCollections> {
    try {
      const [items, total] = await Promise.all([
        this.collectionsRepo.find(),
        this.collectionsRepo.count(),
      ]);
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
   * Update Collections Attributes
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
   * DELETE Collection
   * @param collectionId
   * @returns Message that collection successfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.collectionsRepo.delete({ collectionId: In(ids) });
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
