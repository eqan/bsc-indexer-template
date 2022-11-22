import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CronType } from '../jobs/types/cron.types';
import { RefreshMetadatInput } from './dto/refresh-metadata.dto';
import { ReturnRefreshMeta } from './dto/return.refresh-meta.dto';
import { RefreshMetadataService } from './refresh-metadata.service';

@Resolver()
export class RefreshMetadataResolver {
  constructor(
    private readonly refreshMetadataService: RefreshMetadataService,
  ) {}

  @Mutation(() => ReturnRefreshMeta, {
    name: 'RefreshMetadata',
  })
  async RefreshMetadata(
    @Args('RefreshMetadatInput')
    { collectionId, tokenId }: RefreshMetadatInput,
  ): Promise<ReturnRefreshMeta> {
    try {
      return await this.refreshMetadataService.refrsehMetadata(
        collectionId,
        tokenId,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
