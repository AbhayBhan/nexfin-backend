import { PartialType } from '@nestjs/mapped-types';
import { AddFinanceDto } from './add-finance.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFinanceDto extends PartialType(AddFinanceDto) {
  @IsString()
  @IsNotEmpty()
  financeId: string;
}