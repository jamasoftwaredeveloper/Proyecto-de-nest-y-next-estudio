// src/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionMongoService } from 'src/sesions/mongo/sessionMongo.service';
import { SessionService } from 'src/sesions/postgres/session.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly sessionService: SessionService, private readonly sessionMongoService: SessionMongoService) { }
  use(req: Request, res: Response, next: NextFunction) {
    // Aquí puedes usar tu servicio
    const headers = req.headers;
    this.sessionService.create({ origin: headers.origin, method: req.method, ip: req.ip });
    if (headers?.type === "mongo") {
      this.sessionMongoService.create({ origin: headers.origin, method: req.method, ip: req.ip });
    }
    console.log('headers', headers);

    next();
  }
}
