import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/drizzle/db';
import { AccountTable, ExpensesTable } from 'src/drizzle/schema';
import { AddExpenseDto } from './dto/add-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { title } from 'process';

@Injectable()
export class ExpenseService {
  async getAllExpenses(id: string) {
    try {
      const userAccount = await db.query.AccountTable.findFirst({
        where: eq(AccountTable.userId, id),
      });

      if (!userAccount) {
        throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
      }

      const expenses = await db.query.ExpensesTable.findMany({
        where: eq(ExpensesTable.accountId, userAccount.id),
        columns: {
          id: true,
          expense: true,
        },
      });

      return expenses;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve Expenses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addExpense(addExpenseDto: AddExpenseDto, id: string) {
    try {
      const { title, amount, date, completed } = addExpenseDto;

      const userAccount = await db.query.AccountTable.findFirst({
        where: eq(AccountTable.userId, id),
      });

      if (!userAccount) {
        throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
      }

      await db.insert(ExpensesTable).values({
        accountId: userAccount.id,
        expense: {
          title,
          amount,
          date,
          completed,
        },
      });

      return { message: 'Expense added successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to add expense',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateExpense(updateExpenseDto: UpdateExpenseDto, id: string) {
    try {
      const userAccount = await db.query.AccountTable.findFirst({
        where: eq(AccountTable.userId, id),
      });

      if (!userAccount) {
        throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
      }

      const expense = await db.query.ExpensesTable.findFirst({
        where: eq(ExpensesTable.id, updateExpenseDto.expenseId),
      });

      if (!expense || expense.accountId !== userAccount.id) {
        throw new HttpException('Expense not found', HttpStatus.BAD_REQUEST);
      }

      const { expenseId, ...updatePayload } = updateExpenseDto;

      await db
        .update(ExpensesTable)
        .set({ expense: { ...expense.expense, ...updatePayload } })
        .where(eq(ExpensesTable.id, expenseId));

      return { message: 'Expense updated successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update expense',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteExpense(id: string, expenseId: string) {
    try {
      const userAccount = await db.query.AccountTable.findFirst({
        where: eq(AccountTable.userId, id),
      });

      if (!userAccount) {
        throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
      }

      const expense = await db.query.ExpensesTable.findFirst({
        where: eq(ExpensesTable.id, expenseId),
      });

      if (!expense || expense.accountId !== userAccount.id) {
        throw new HttpException('Expense not found', HttpStatus.BAD_REQUEST);
      }

      await db.delete(ExpensesTable).where(eq(ExpensesTable.id, expenseId));

      return { message: 'Expense deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete expense',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
