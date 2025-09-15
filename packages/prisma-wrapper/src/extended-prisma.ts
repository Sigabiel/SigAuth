import { Prisma } from '../prisma/generated/client/client.js';

export type AccountWithPermissions = Prisma.AccountGetPayload<{
    include: {
        permissions: true;
    };
}>;
