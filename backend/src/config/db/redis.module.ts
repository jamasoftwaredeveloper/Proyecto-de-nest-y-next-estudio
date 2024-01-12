// src/redis/redis.module.ts

import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-yet";
// redis.module.ts
/*
import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';

@Module({
  imports: [
    RedisModule.register({
      host: 'localhost',
      port: 6379,
      // Otros parámetros según sea necesario
    }),
  ],
  exports: [RedisModule],
})
export class RedisConfigModule {}
*/

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: parseInt(configService.get<string>('REDIS_PORT')!),
      },
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};