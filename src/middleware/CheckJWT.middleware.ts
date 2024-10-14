import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

@Injectable()
export class CheckJWTMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const publicKey = fs.readFileSync('public_key.pem', 'utf-8');

      const token =
        req.headers.authorization && req.headers.authorization.split(' ')[1];

      if (!token) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      if (typeof decoded !== 'object') {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      if ('scope' in decoded) {
        if (decoded.scope === 'get:data_anon') {
          req.id = decoded.id;
          next();
        } else {
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException(
        'Failed to authenticate token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
