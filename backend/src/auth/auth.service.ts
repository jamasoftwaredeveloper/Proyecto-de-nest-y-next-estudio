import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';

import { JwtService } from '@nestjs/jwt';

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

        const payload = { email: user.email, sub: user.id, role: user.role }
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }

    async profile({ email, role }: { email: string, role: string }) {
        /* if (role !== "admin") {
             throw new UnauthorizedException('You are not authorized to access this resource');
         }
         */
        return await this.usersService.findOneByEmail(email);
    }
}
