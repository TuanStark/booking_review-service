// prisma.config.ts
import { defineConfig, env } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'), // bắt buộc phải có
  },
  // Nếu bạn muốn seed
  // seed: 'prisma/seed.ts',
});