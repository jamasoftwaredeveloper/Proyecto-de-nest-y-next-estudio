import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { RegisterDto } from '../dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { AuthDto } from '../dto/auth.dto';

import { JwtService } from '@nestjs/jwt';
import { UserMongoService } from 'src/users/mongo/userMongo.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class AuthMongoService {
    constructor(
        private readonly usersService: UserMongoService,
        private readonly jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async register({ name, email, password, type }: RegisterDto) {

        const user = await this.cacheManager.get(email);

        let userData = null;

        if (Object.keys(user).length !== 0) {
            userData = user;
        } else {
            userData = await this.usersService.findOneByEmail(email);
        }
        if (user) {
            throw new BadRequestException('User already exists');
        }

        const userNew = this.usersService.create({ name, email, password: await bcryptjs.hash(password, 10), type });

        const access_token = await this.generateAccessToken(userNew);
        const refresh_token = await this.generateRefreshToken(userNew);

        return { userNew, access_token, refresh_token };
    }

    async login({ email, password }: AuthDto) {

        const user = await this.cacheManager.get(email);
        let userData = null;
        if (Object.keys(user).length !== 0) {
            userData = user;
        } else {
            userData = await this.usersService.findOneByEmailWithPassword(email);
        }
        
        if (!userData) {
            throw new UnauthorizedException('Email or password is wrong');
        }
        const isPasswordValid = await bcryptjs.compare(password, userData.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Email or password is wrong');
        }

        const access_token = await this.generateAccessToken(userData);
        const refresh_token = await this.generateRefreshToken(userData);

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
        const payload = { email: user.email, sub: user.id, role: user.role, iss: process.env.URN_SYSTEM_APP };
        const refreshToken = this.jwtService.signAsync(
            payload,
            { expiresIn: '1d' },
        );
        return refreshToken;
    }


    async generateAccessToken(user): Promise<string> {
        const payload = { email: user.email, sub: user.id, role: user.role, iss: process.env.URN_SYSTEM_APP };
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
