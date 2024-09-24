/*
  Warnings:

  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `club_id` on the `Role` table. All the data in the column will be lost.
  - The required column `id` was added to the `Role` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_club_id_fkey";

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
DROP COLUMN "club_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ClubRole" (
    "clubId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ClubRole_pkey" PRIMARY KEY ("clubId","roleId")
);

-- AddForeignKey
ALTER TABLE "ClubRole" ADD CONSTRAINT "ClubRole_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRole" ADD CONSTRAINT "ClubRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRole" ADD CONSTRAINT "ClubRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("collegeRegistrationID") ON DELETE RESTRICT ON UPDATE CASCADE;
