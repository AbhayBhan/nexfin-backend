import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/drizzle/db';
import { AccountTable, FinanceTable } from 'src/drizzle/schema';
import { AddFinanceDto } from './dto/add-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';

@Injectable()
export class FinanceService {
  async fetchFinanceList(id: string) {
    try {
      const userAccount = await db.query.AccountTable.findFirst({
        where: eq(AccountTable.userId, id),
      });

      if (!userAccount) {
        throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
      }

      const finances = await db.query.FinanceTable.findMany({
        where: eq(FinanceTable.accountId, userAccount.id),
        columns: {
          id: true,
          finance: true,
        },
      });

      return finances;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch finance list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addFinance(addFinanceDto: AddFinanceDto, id: string) {
    try {
      const { title, amount, date, received } = addFinanceDto;

      const userAccount = await db.query.AccountTable.findFirst({
        where: eq(AccountTable.userId, id),
      });

      if (!userAccount) {
        throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
      }

      await db.insert(FinanceTable).values({
        accountId: userAccount.id,
        finance: {
          title,
          amount,
          date,
          received,
        },
      });

      return { message: 'Expense added successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to add finance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFinance(id: string, financeId: string) {
    try {
      const userAccount = await db.query.AccountTable.findFirst({
        where: eq(AccountTable.userId, id),
      });

      if (!userAccount) {
        throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
      }

      const finance = await db.query.FinanceTable.findFirst({
        where: eq(FinanceTable.id, financeId),
      });

      if (!finance || finance.accountId !== userAccount.id) {
        throw new HttpException('Expense not found', HttpStatus.BAD_REQUEST);
      }

      await db.delete(FinanceTable).where(eq(FinanceTable.id, financeId));

      return { message: 'Expense deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete finance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateFinance(updateFinanceDto: UpdateFinanceDto, id: string) {
    try {
      const userAccount = await db.query.AccountTable.findFirst({
        where: eq(AccountTable.userId, id),
      });

      const { financeId, ...updatePayload } = updateFinanceDto;

      const finance = await db.query.FinanceTable.findFirst({
        where: eq(FinanceTable.id, financeId),
      });

      if (!finance || finance.accountId !== userAccount.id) {
        throw new HttpException('Finance not found', HttpStatus.BAD_REQUEST);
      }

      await db
        .update(FinanceTable)
        .set({ finance: { ...finance.finance, ...updatePayload } })
        .where(eq(FinanceTable.id, financeId));

      return { message: 'Finance updated successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete finance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
