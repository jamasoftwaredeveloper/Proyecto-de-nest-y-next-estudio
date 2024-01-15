// src/middleware/logger.middleware.ts
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/postgres/users.service';
import { Cache } from 'cache-manager';
import { UserMongoService } from 'src/users/mongo/userMongo.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService, private readonly userMongoService: UserMongoService, @Inject(CACHE_MANAGER) private cacheManager: Cache) { }
  async use(req: Request, res: Response, next: NextFunction) {
    // Aquí puedes usar tu servicio
    const headers = req.headers;
    let user = null;
    const email = req.body.email;
    if (req.body.type === "app") {
      user = await this.userMongoService.findOneByEmailWithPassword(email);
    } else {
      user = await this.userService.findOneByEmailWithPassword(email);
    }

    let data = null;
    if (user) {
      data = {
        origin: headers?.origin,
        ip: req?.ip,
        type: user?.type,
        email: user?.email,
        password: user?.password,
        role: user?.role
      }
      this.cacheManager.set(email, data, 1000000 * 10);
    }
    next();
  }
}
