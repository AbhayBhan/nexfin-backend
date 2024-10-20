import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { CheckJWTMiddleware } from 'src/middleware/checkjwt.middleware';

@Module({
  providers: [AccountService],
  controllers: [AccountController]
})
export class AccountModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckJWTMiddleware).forRoutes("account")
  }
}
