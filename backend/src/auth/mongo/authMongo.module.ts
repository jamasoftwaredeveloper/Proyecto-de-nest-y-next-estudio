import { Module, forwardRef } from '@nestjs/common';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthMongoController } from './authMongo.controller';
import { AuthMongoService } from './authMongo.service';
import { UserModuleMongo } from 'src/users/mongo/userMongo.module';


@Module({
  imports: [
    forwardRef(() => UserModuleMongo),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret:  configService.get<string>('JWT_SECRET'),// jwtConstants.secret,
        global: true,
        signOptions: { expiresIn: '1d' },
        refreshTokenExpiresIn: '7d', // Tiempo de vida del token de renovación
      }),
      inject: [ConfigService],
    }),
    
  ],
  controllers: [AuthMongoController],
  providers: [AuthMongoService],
  exports: [JwtModule],
})
export class AuthMongoModule {}
