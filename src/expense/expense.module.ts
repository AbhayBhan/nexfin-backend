import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { CheckJWTMiddleware } from 'src/middleware/checkjwt.middleware';

@Module({
  providers: [ExpenseService],
  controllers: [ExpenseController],
})
export class ExpenseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckJWTMiddleware).forRoutes('expense');
  }
}
