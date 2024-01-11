import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { RegisterDto } from '../dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { AuthDto } from '../dto/auth.dto';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/postgres/users.service';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async register({ name, email, password }: RegisterDto) {
        const user = await this.usersService.findOneByEmail(email);

        if (user) {
            throw new BadRequestException('User already exists');
        }

        return await this.usersService.create({ name, email, password: await bcryptjs.hash(password, 10) });
    }

    async login({ email, password }: AuthDto) {

        const user = await this.usersService.findOneByEmailWithPassword(email);
        if (!user) {
            throw new UnauthorizedException('Email or password is wrong');
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Email or password is wrong');
        }

        const access_token = await this.generateAccessToken(user);
        const refresh_token = await this.generateRefreshToken(user);

        return { access_token, refresh_token };
    }

    async profile({ email, role }: { email: string, role: string }) {
        /* if (role !== "admin") {
             throw new UnauthorizedException('You are not authorized to access this resource');
         }
         */
        return await this.usersService.findOneByEmail(email);
    }


    async generateRefreshToken(user): Promise<string> {
        // Implementa la lógica de generación de token de renovación aquí
        const payload = { email: user.email, sub: user.id, role: user.role };
        const refreshToken = this.jwtService.signAsync(
            payload,
            { expiresIn: '7d' },
        );
        return refreshToken;
    }


    async generateAccessToken(user): Promise<string> {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return this.jwtService.signAsync(payload, { expiresIn: '1h' });
    }

    async validateRefreshToken(refreshToken: string): Promise<boolean> {
        // Implementa la lógica de validación de token de renovación aquí
        try {
            this.jwtService.verify(refreshToken);
            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

}
