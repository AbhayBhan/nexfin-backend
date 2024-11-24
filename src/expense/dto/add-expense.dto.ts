import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class AddExpenseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;
}