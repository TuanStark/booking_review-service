// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { prisma } from './client';

@Injectable()
export class PrismaService implements OnModuleInit {
    async onModuleInit() {
        console.log('Connecting to the database...');
        await prisma.$connect();
    }

    // Optional: graceful shutdown
    async enableShutdownHooks(app: any) {
        process.on('beforeExit', async () => {
            await app.close();
        });
    }
}