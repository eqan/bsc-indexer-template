import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { QueueType } from '../enums/jobs.enums';
import { RefreshMetadataService } from '../refresh-metadata/refresh-metadata.service';
import { CronType } from '../types/cron.types';
import { RefreshMetadatInput } from '../types/job.types';

@Resolver()
export class RefreshMetadataResolver {
  constructor(
    private readonly refreshMetadataService: RefreshMetadataService,
  ) {}
  CRON_NAME = QueueType.REFRESH_METADATA_QUEUE;

  @Mutation(() => CronType, {
    name: 'RefreshMetadata',
  })
  async RefreshMetadata(
    @Args('RefreshMetadatInput')
    { collectionId, tokenId }: RefreshMetadatInput,
  ): Promise<CronType> {
    try {
      this.refreshMetadataService.addRefrsehMetadataJob(collectionId, tokenId);
      return { isDone: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
