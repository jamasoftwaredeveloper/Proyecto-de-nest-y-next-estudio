// user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthMongoModule } from 'src/auth/mongo/authMongo.module';
import { Session } from '../entities/session.entity';
import { SessionSchema } from './schemas/sessionMongo.schema';
import { SessionMongoController } from './sessionMongo.controller';
import { SessionMongoService } from './sessionMongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]), AuthMongoModule
  ],
  controllers: [SessionMongoController],
  providers: [SessionMongoService],
  exports: [SessionMongoService]
})
export class SessionModuleMongo {}
