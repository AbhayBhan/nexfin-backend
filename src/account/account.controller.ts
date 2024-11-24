import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/')
  getAccount(@Req() req: Request) {
    return this.accountService.getAccountData(req.id);
  }

  @Get('/add-balance')
  addAmount(@Req() req: Request, @Query('amount') amount: string) {
    return this.accountService.addBalance(parseInt(amount), req.id);
  }

  @Get('/deduct-balance')
  deductAmount(@Req() req: Request, @Query('amount') amount: string) {
    return this.accountService.deductBalance(parseInt(amount), req.id);
  }
}
