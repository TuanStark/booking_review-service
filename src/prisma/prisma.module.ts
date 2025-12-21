// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';
import prisma from './client';

@Global()
@Module({
    providers: [
        PrismaService,
        {
            provide: PrismaClient,
            useValue: prisma,
        },
    ],
    exports: [PrismaService, PrismaClient],
})
export class PrismaModule { }