/*
  Warnings:

  - You are about to drop the column `members` on the `Club` table. All the data in the column will be lost.
  - Made the column `clubId` on table `Role` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Club" DROP COLUMN "members";

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "clubId" SET NOT NULL;
