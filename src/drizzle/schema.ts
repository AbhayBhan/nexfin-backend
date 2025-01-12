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
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const BankAccountTable = pgTable('bankaccounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('accountId')
    .notNull()
    .references(() => AccountTable.id),
  bankName: varchar('bankName').notNull(),
  balance: integer('balance').notNull().default(0),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

export const ExpensesTable = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('accountId')
    .notNull()
    .references(() => AccountTable.id),
  expense: json('expense').notNull().$type<expense>(),
  bankAccountId: uuid('bankAccountId')
    .references(() => BankAccountTable.id),
});

export const FinanceTable = pgTable('finances', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('accountId')
    .notNull()
    .references(() => AccountTable.id),
  finance: json('finance').notNull().$type<finance>(),
  bankAccountId: uuid('bankAccountId')
    .notNull()
    .references(() => BankAccountTable.id),
});

export const InvestmentsTable = pgTable('investments', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('accountId')
    .notNull()    
    .references(() => AccountTable.id),
  investmentName: varchar('investmentName').notNull(),
  amount: integer('amount').notNull().default(0),
  linkedTo: uuid('linkedTo').references(() => BankAccountTable.id),
})

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
      bankaccount: many(BankAccountTable),
      investments: many(InvestmentsTable)
    };
  },
);

export const BankTableRelations = relations(
  BankAccountTable,
  ({ one }) => {
    return {
      account: one(AccountTable, {
        fields: [BankAccountTable.accountId],
        references: [AccountTable.id],
      }),
    };
  },
);

export const InvestmentsTableRelations = relations(
  InvestmentsTable,
  ({ one }) => {
    return {
      account: one(AccountTable, {
        fields: [InvestmentsTable.accountId],
        references: [AccountTable.id],
      }),
      bankaccounts: one(BankAccountTable, {
        fields: [InvestmentsTable.linkedTo],
        references: [BankAccountTable.id],
      }),
    };
  },
)

export const ExpensesTableRelations = relations(
  ExpensesTable,
  ({ one }) => {
    return {
      account: one(AccountTable, {
        fields: [ExpensesTable.accountId],
        references: [AccountTable.id],
      }),
      bankaccounts: one(BankAccountTable, {
        fields: [ExpensesTable.bankAccountId],
        references: [BankAccountTable.id],
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
      bankaccounts: one(BankAccountTable, {
        fields: [FinanceTable.bankAccountId],
        references: [BankAccountTable.id],
      }),
    };
  },
)

