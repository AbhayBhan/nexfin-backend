import {
  integer,
  json,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { expense, finance } from './types';
import { relations } from 'drizzle-orm';

export const UserTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('firstName', { length: 255 }).notNull(),
  lastName: varchar('lastName', { length: 255 }),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  mobile: varchar('mobile', { length: 255 }).unique(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const SettingTable = pgTable('setting', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => UserTable.id),
  currency: varchar('currency').notNull().default('INR'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const AccountTable = pgTable('account', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => UserTable.id),
  balance: integer('balance').notNull().default(0),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const ExpensesTable = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('accountId')
    .notNull()
    .references(() => AccountTable.id),
  expense: json('expense').notNull().$type<expense>(),
});

export const FinanceTable = pgTable('finances', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('accountId')
    .notNull()
    .references(() => AccountTable.id),
  finance: json('finance').notNull().$type<finance>(),
});

// RELATIONS

export const UserTableRelations = relations(UserTable, ({ one }) => {
  return {
    settings: one(SettingTable),
    accounts: one(AccountTable),
  };
});

export const SettingTableRelations = relations(SettingTable, ({ one }) => {
  return {
    user : one(UserTable, {
      fields : [SettingTable.userId],
      references : [UserTable.id],
    })
  }
});

export const AccountTableRelations = relations(
  AccountTable,
  ({ one, many }) => {
    return {
      user: one(UserTable, {
        fields: [AccountTable.userId],
        references: [UserTable.id],
      }),
      expenses: many(ExpensesTable),
      finances: many(FinanceTable),
    };
  },
);

export const ExpensesTableRelations = relations(
  ExpensesTable,
  ({ one }) => {
    return {
      account: one(AccountTable, {
        fields: [ExpensesTable.accountId],
        references: [AccountTable.id],
      }),
    };
  },
)

export const FinanceTableRelations = relations(
  FinanceTable,
  ({ one }) => {
    return {
      account: one(AccountTable, {
        fields: [FinanceTable.accountId],
        references: [AccountTable.id],
      }),
    };
  },
)

