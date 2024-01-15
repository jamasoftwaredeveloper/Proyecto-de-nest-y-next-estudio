import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { BreedsModule } from './breeds/breeds.module';
// import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/postgres/users.module';
import { AuthModule } from './auth/postgres/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { MongoModule } from './config/db/mongo.module';

import { PostgresModule } from './config/db/postgres.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/mongo/schemas/userMongo.schema';
import { UserModuleMongo } from './users/mongo/userMongo.module';
import { AuthMongoModule } from './auth/mongo/authMongo.module';
// import { SessionModule } from './sesions/postgres/session.module';
// import { SessionModuleMongo } from './sesions/mongo/sessionMongo.module';
import {  CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './config/db/redis.module';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule,
    PostgresModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    UserModuleMongo,
    AuthModule,
    AuthMongoModule,
    TypeOrmModule,
    CacheModule.registerAsync( RedisOptions ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}