import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { Request } from 'express';
import { AddExpenseDto } from './dto/add-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get('/list')
  getExpenseList(@Req() req: Request) {
    return this.expenseService.getAllExpenses(req.id);
  }

  @Post('/add')
  @HttpCode(201)
  addExpense(
    @Body(ValidationPipe) addExpenseDto: AddExpenseDto,
    @Req() req: Request,
  ) {
    return this.expenseService.addExpense(addExpenseDto, req.id);
  }

  @Put('/update')
  @HttpCode(200)
  updateExpense(
    @Req() req: Request,
    @Body(ValidationPipe) updateExpenseDto: UpdateExpenseDto
  ) {
    return this.expenseService.updateExpense(
      updateExpenseDto,
      req.id
    );
  }

  @Delete('/delete')
  @HttpCode(200)
  deleteExpense(@Req() req: Request, @Query("id") expenseId: string) {
    return this.expenseService.deleteExpense(req.id, expenseId);
  }
}
