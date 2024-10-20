import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/drizzle/db';
import { UserTable } from 'src/drizzle/schema';

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
}
