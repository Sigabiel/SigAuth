import type { Account } from "@sigauth/prisma-wrapper/prisma-client";

export type SessionContext = {
    account: Account;
}