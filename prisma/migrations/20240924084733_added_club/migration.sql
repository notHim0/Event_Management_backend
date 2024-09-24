/*
  Warnings:

  - You are about to drop the column `club_organisers` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roleName` on the `User` table. All the data in the column will be lost.
  - The required column `id` was added to the `Role` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleName_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "club_organisers",
ADD COLUMN     "club_id" TEXT;

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleName";

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "members" TEXT,
    "description" TEXT NOT NULL,
    "acheivements" TEXT,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubRole" (
    "clubId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ClubRole_pkey" PRIMARY KEY ("clubId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRole" ADD CONSTRAINT "ClubRole_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRole" ADD CONSTRAINT "ClubRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRole" ADD CONSTRAINT "ClubRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("collegeRegistrationID") ON DELETE RESTRICT ON UPDATE CASCADE;
