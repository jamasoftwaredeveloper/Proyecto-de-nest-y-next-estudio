import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/postgres/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    forwardRef(() =>UsersModule),
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
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
