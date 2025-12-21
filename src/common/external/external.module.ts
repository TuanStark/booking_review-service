import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExternalService } from './external.service';
import { RedisModule } from '../../messaging/redis/redis.module';

@Module({
  imports: [HttpModule, RedisModule],
  providers: [ExternalService],
  exports: [ExternalService],
})
export class ExternalModule {}
