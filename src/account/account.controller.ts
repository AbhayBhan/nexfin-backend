import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get("/")
  getAccount(@Req() req: Request) {
    return this.accountService.getAccountData(req.id);
  }
}
