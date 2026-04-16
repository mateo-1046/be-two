import { Module } from '@nestjs/common';
import { ParseMongoIdPipe } from './pipes/parse-mongo-id.pipe';

@Module({
  providers: [ParseMongoIdPipe],
  exports: [ParseMongoIdPipe],
})
export class CommonModule {}
