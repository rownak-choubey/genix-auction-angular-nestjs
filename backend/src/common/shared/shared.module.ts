import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from 'src/services/database.service';

@Module({
  imports: [ConfigModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class SharedModule {}
