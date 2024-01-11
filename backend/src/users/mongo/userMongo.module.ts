// user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoController } from './userMongo.controller';
import { UserMongoService } from './userMongo.service';
import { User, UserSchema } from './schemas/userMongo.schema';
import { AuthMongoModule } from 'src/auth/mongo/authMongo.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), AuthMongoModule
  ],
  controllers: [UserMongoController],
  providers: [UserMongoService],
  exports: [UserMongoService]
})
export class UserModuleMongo {}
