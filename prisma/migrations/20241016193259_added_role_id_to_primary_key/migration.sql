/*
  Warnings:

  - The primary key for the `UserClubRole` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "UserClubRole" DROP CONSTRAINT "UserClubRole_pkey",
ADD CONSTRAINT "UserClubRole_pkey" PRIMARY KEY ("clubId", "userId", "roleId");
