import { AccountWithPermissions } from '@src/common/types/extended-prisma';

declare global {
    namespace Express {
        interface Request {
            account?: AccountWithPermissions; // durch authentication guard
            cookies: Record<string, string>; // durch cookie-parser package
        }
    }
}
