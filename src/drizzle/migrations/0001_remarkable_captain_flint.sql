CREATE TABLE IF NOT EXISTS "bankaccounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accountId" uuid NOT NULL,
	"bankName" varchar NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "investments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accountId" uuid NOT NULL,
	"investmentName" varchar NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"linkedTo" uuid
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "bankAccountId" uuid;--> statement-breakpoint
ALTER TABLE "finances" ADD COLUMN "bankAccountId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bankaccounts" ADD CONSTRAINT "bankaccounts_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "investments" ADD CONSTRAINT "investments_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "investments" ADD CONSTRAINT "investments_linkedTo_bankaccounts_id_fk" FOREIGN KEY ("linkedTo") REFERENCES "public"."bankaccounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenses" ADD CONSTRAINT "expenses_bankAccountId_bankaccounts_id_fk" FOREIGN KEY ("bankAccountId") REFERENCES "public"."bankaccounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "finances" ADD CONSTRAINT "finances_bankAccountId_bankaccounts_id_fk" FOREIGN KEY ("bankAccountId") REFERENCES "public"."bankaccounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "balance";