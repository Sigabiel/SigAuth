/*
  Warnings:

  - You are about to drop the column `accessToken` on the `AuthorizationInstance` table. All the data in the column will be lost.
  - You are about to drop the column `accessTokenExpire` on the `AuthorizationInstance` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."AuthorizationInstance_accessToken_key";

-- AlterTable
ALTER TABLE "AuthorizationInstance" DROP COLUMN "accessToken",
DROP COLUMN "accessTokenExpire";
