// src/postgres/postgres.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT,10),
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        autoLoadEntities: true,
        synchronize: true,
        ssl: process.env.POSTGRES_SSL === "true",
        extra: {
          ssl:
            process.env.POSTGRES_SSL === "true"
              ? {
                rejectUnauthorized: false,
              }
              : null,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class PostgresModule {}
