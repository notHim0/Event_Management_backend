/*
  Warnings:

  - You are about to drop the column `club_organisers` on the `Event` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('STUDENT', 'PASSOUT', 'FACULTY');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleName_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "club_organisers",
ADD COLUMN     "club_id" TEXT;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "club_id" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Roles";

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "members" TEXT,
    "description" TEXT NOT NULL,
    "acheivements" TEXT,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
