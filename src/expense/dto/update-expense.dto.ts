import { PartialType } from '@nestjs/mapped-types';
import { AddExpenseDto } from './add-expense.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateExpenseDto extends PartialType(AddExpenseDto) {
  @IsString()
  @IsNotEmpty()
  expenseId: string;
}
