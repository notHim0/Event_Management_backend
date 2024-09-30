/*
  Warnings:

  - The `members` column on the `Club` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Club" DROP COLUMN "members",
ADD COLUMN     "members" TEXT[];

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "clubId" TEXT;
