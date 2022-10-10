import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionssInput } from './dto/create-collectionss.input';
import { UpdateCollectionssInput } from './dto/update-collectionss.input';
import { Collectionss } from './entities/collectionss.entity';

@Injectable()
export class CollectionssService {
  constructor(
    @InjectRepository(Collectionss)
    private collectionsRepo: Repository<Collectionss>,
  ) {}

  /**
   * Create Collection in Database
   * @param createCollectionssInput
   * @returns Collection
   */
  async createCollection(
    createCollectionssInput: CreateCollectionssInput,
  ): Promise<Collectionss> {
    try {
      const collection: Collectionss = new Collectionss();
      collection.collection_id = createCollectionssInput.collection_id;
      collection.name = createCollectionssInput.name;
      collection.slug = createCollectionssInput.slug;
      collection.ImageUrl = createCollectionssInput.ImageUrl;
      collection.bannerImageUrl = createCollectionssInput.bannerImageUrl;
      collection.externalUrl = createCollectionssInput.externalUrl;
      collection.discordUrl = createCollectionssInput.discordUrl;
      collection.twitterUserName = createCollectionssInput.twitterUserName;
      collection.description = createCollectionssInput.description;
      await this.collectionsRepo.save(collection);
      return collection;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Collections
   * @@params No Params
   * @returns
   */
  async findAllCollectionss(): Promise<Collectionss[]> {
    try {
      const found = await this.collectionsRepo.find();
      if (!found) {
        throw new NotFoundException('No Collections Found');
      }
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * GET Collection By Id
   * @param id
   * @returns Collection against Provided Id
   */
  async getCollectionById(collection_id: string): Promise<Collectionss> {
    try {
      const found = await this.collectionsRepo.findOneBy({ collection_id });
      if (!found) {
        throw new NotFoundException(
          `Collection against ${collection_id}} not found`,
        );
      }
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Collections Atributes
   * @param updateCollectionssInput
   * @returns
   */
  async updateCollectionAttribute(
    updateCollectionssInput: UpdateCollectionssInput,
  ): Promise<Collectionss> {
    try {
      const collection: Collectionss = await this.collectionsRepo.findOne({
        where: { collection_id: updateCollectionssInput.collection_id },
      });
      collection.ImageUrl = updateCollectionssInput.ImageUrl;
      collection.bannerImageUrl = updateCollectionssInput.bannerImageUrl;
      collection.description = updateCollectionssInput.discordUrl;
      collection.discordUrl = updateCollectionssInput.discordUrl;
      collection.externalUrl = updateCollectionssInput.externalUrl;
      collection.twitterUserName = updateCollectionssInput.twitterUserName;
      await this.collectionsRepo.save(collection);
      return collection;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * DEETE Collection
   * @param collection_id
   * @returns Message that collection succesfully deleted
   */
  async remove(collection_id: string): Promise<string> {
    try {
      const found = await this.collectionsRepo.delete(collection_id);
      if (!found) {
        throw new NotFoundException('Collection not found');
      }
      return 'Collection Deleted Succesfully';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
