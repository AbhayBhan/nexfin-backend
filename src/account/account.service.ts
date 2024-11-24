import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/drizzle/db';
import { AccountTable, UserTable } from 'src/drizzle/schema';

@Injectable()
export class AccountService {
  async getAccountData(id: string) {
    try {
      const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.id, id),
        with: {
          accounts: {
            columns: {
              balance: true,
              id: true,
            },
          },
        },
      });

      if (!user) {
        throw new HttpException('User not Found.', HttpStatus.BAD_REQUEST);
      }

      return user.accounts;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to register user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addBalance(amount: number, id: string) {
    try {
      if (amount < 0) {
        throw new HttpException('Invalid amount', HttpStatus.BAD_REQUEST);
      }

      const userAccount = await db.query.AccountTable.findFirst({
        where: eq(AccountTable.userId, id),
      });

      if (!userAccount) {
        throw new HttpException('Account not Found.', HttpStatus.BAD_REQUEST);
      }

      userAccount.balance += amount;

      await db
        .update(AccountTable)
        .set(userAccount)
        .where(eq(AccountTable.userId, id));

      return { message: 'Successfully added balance' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to register user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deductBalance(amount: number, id: string) {
    try {
      if (amount < 0) {
        throw new HttpException('Invalid amount', HttpStatus.BAD_REQUEST);
      }

      const userAccount = await db.query.AccountTable.findFirst({
        where: eq(AccountTable.userId, id),
      });

      if (!userAccount) {
        throw new HttpException('Account not Found.', HttpStatus.BAD_REQUEST);
      }

      if (userAccount.balance < amount) {
        throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
      }

      userAccount.balance -= amount;

      await db
        .update(AccountTable)
        .set(userAccount)
        .where(eq(AccountTable.userId, id));

      return { message: 'Successfully deducted balance' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to register user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
