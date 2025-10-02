/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorizationCode` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `challenge` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Session` table. All the data in the column will be lost.
  - The `created` column on the `Session` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Session_authorizationCode_key";

-- DropIndex
DROP INDEX "public"."Session_refreshToken_key";

-- DropIndex
DROP INDEX "public"."Session_sessionId_key";

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
DROP COLUMN "authorizationCode",
DROP COLUMN "challenge",
DROP COLUMN "refreshToken",
DROP COLUMN "sessionId",
ADD COLUMN     "id" TEXT NOT NULL,
DROP COLUMN "created",
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "AuthorizationInstance" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "accessTokenExpire" INTEGER NOT NULL,
    "refreshTokenExpire" INTEGER NOT NULL,

    CONSTRAINT "AuthorizationInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorizationChallenge" (
    "id" SERIAL NOT NULL,
    "challenge" TEXT,
    "sessionId" TEXT NOT NULL,
    "appId" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthorizationChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizationInstance_accessToken_key" ON "AuthorizationInstance"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizationInstance_refreshToken_key" ON "AuthorizationInstance"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizationChallenge_challenge_key" ON "AuthorizationChallenge"("challenge");

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- AddForeignKey
ALTER TABLE "AuthorizationInstance" ADD CONSTRAINT "AuthorizationInstance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizationChallenge" ADD CONSTRAINT "AuthorizationChallenge_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizationChallenge" ADD CONSTRAINT "AuthorizationChallenge_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
