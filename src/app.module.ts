import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ExternalModule } from './common/external/external.module';
import { ConfigModule } from '@nestjs/config';

@Module({
 imports: [PrismaModule, ExternalModule, ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
