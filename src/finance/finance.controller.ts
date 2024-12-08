import { Request } from 'express';
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
import { FinanceService } from './finance.service';
import { AddFinanceDto } from './dto/add-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('/list')
  getFinanceList(@Req() req: Request) {
    return this.financeService.fetchFinanceList(req.id);
  }

  @Post('/add')
  @HttpCode(201)
  addFinance(
    @Body(ValidationPipe) addFinanceDto: AddFinanceDto,
    @Req() req: Request,
  ) {
    return this.financeService.addFinance(addFinanceDto, req.id);
  }

  @Delete('/delete')
  deleteFinance(@Req() req: Request, @Query('id') financeId: string) {
    return this.financeService.deleteFinance(req.id, financeId);
  }

  @Put("/")
  updateFinance(@Body(ValidationPipe) updateFinanceDto : UpdateFinanceDto, @Req() req: Request) {
    return this.financeService.updateFinance(updateFinanceDto, req.id)
  }
}
