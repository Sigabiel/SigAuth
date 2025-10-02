/*
  Warnings:

  - A unique constraint covering the columns `[authorizationCode]` on the table `AuthorizationChallenge` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorizationCode` to the `AuthorizationChallenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthorizationChallenge" ADD COLUMN     "authorizationCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizationChallenge_authorizationCode_key" ON "AuthorizationChallenge"("authorizationCode");
