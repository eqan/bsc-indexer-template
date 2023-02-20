import { Module } from '@nestjs/common';
import { PrepareTransactionService } from './prepare-transaction.service';

@Module({
  providers: [PrepareTransactionService],
  exports: [PrepareTransactionService],
})
export class PrepareTransactionModule {}
