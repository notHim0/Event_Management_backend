/*
  Warnings:

  - The primary key for the `ClubRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roleName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClubRole" DROP CONSTRAINT "ClubRole_pkey",
ADD CONSTRAINT "ClubRole_pkey" PRIMARY KEY ("clubId", "userId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
DROP COLUMN "roleName";

-- DropEnum
DROP TYPE "Roles";
