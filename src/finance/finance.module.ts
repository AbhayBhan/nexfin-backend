import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { CheckJWTMiddleware } from 'src/middleware/checkjwt.middleware';

@Module({
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckJWTMiddleware).forRoutes('finance');
  }
}
