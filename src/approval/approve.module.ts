import { Module } from '@nestjs/common';
import { ApproveService } from './approve.service';

@Module({
  providers: [ApproveService],
  exports: [ApproveService],
})
export class ApproveModule {}
