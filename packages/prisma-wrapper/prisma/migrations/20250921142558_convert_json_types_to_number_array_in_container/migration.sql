/*
  Warnings:

  - The `assets` column on the `Container` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `apps` column on the `Container` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Container" DROP COLUMN "assets",
ADD COLUMN     "assets" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
DROP COLUMN "apps",
ADD COLUMN     "apps" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
