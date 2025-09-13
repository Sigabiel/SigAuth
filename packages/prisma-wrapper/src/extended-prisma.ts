import { Prisma } from '@prisma/client';

export type AccountWithPermissions = Prisma.AccountGetPayload<{
    include: {
        permissions: true;
    };
}>;
