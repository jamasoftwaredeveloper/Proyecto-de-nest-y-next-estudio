// src/mongo/mongo.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
        imports: [ConfigModule], //duda
        useFactory: () => ({
          uri: process.env.MONGO_URI || 'mongodb://localhost:27017/db_mongo'
        }),
        inject: [ConfigService] //duda
      }),
  ],
})
export class MongoModule {}
