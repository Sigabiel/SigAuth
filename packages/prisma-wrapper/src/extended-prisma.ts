import { Prisma } from "../prisma/generated/client";

export type AccountWithPermissions = Prisma.AccountGetPayload<{
    include: {
        permissions: true;
    };
}>;
