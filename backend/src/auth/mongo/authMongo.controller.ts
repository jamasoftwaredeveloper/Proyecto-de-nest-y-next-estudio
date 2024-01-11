import { Body, Controller, Post, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';

import { RegisterDto } from '../dto/register.dto';
import { AuthDto } from '../dto/auth.dto';
import { Role } from '../../common/enum/role.enum';
import { Auth } from '../decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { ApiTags } from '@nestjs/swagger';
import { TokenRefreshDto } from 'src/users/dto/token-refresh.dto';
import { AuthMongoService } from './authMongo.service';

@ApiTags('mongo-auth')
@Controller('mongo/auth')
export class AuthMongoController {

    constructor(
        private readonly authService: AuthMongoService
    ) { }

    @Post('register')
    register(
        @Body()
        registerDto: RegisterDto
    ) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body()
    authDto: AuthDto) {
        return this.authService.login(authDto);
    }

    @Get('profile')
    @Auth(Role.User)
    profile(
        @ActiveUser() user: ActiveUserInterface
    ) {
        return this.authService.profile(user);
    }

    
  @Post('refresh-token')
  async refreshToken(@Body() tokenRefreshDto: TokenRefreshDto,  @ActiveUser() user: ActiveUserInterface) {
    const isValidRefresh = await this.authService.validateRefreshToken(tokenRefreshDto.refresh_token);

    if (!isValidRefresh) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Implementa la lógica para generar un nuevo token de acceso aquí
    // Puedes reutilizar la lógica existente en generateAccessToken

    const newAccessToken = await this.authService.generateAccessToken(user);
    return { accessToken: newAccessToken };
  }

}
