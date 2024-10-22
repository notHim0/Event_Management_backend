/*
  Warnings:

  - The primary key for the `Club` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Club` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClubRole" DROP CONSTRAINT "ClubRole_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubRole" DROP CONSTRAINT "ClubRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_club_id_fkey";

-- DropForeignKey
ALTER TABLE "UserClubRole" DROP CONSTRAINT "UserClubRole_clubId_fkey";

-- DropForeignKey
ALTER TABLE "UserClubRole" DROP CONSTRAINT "UserClubRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserEvent" DROP CONSTRAINT "UserEvent_eventID_fkey";

-- DropIndex
DROP INDEX "Club_name_key";

-- AlterTable
ALTER TABLE "Club" DROP CONSTRAINT "Club_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Club_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "roleName" SET DEFAULT 'Member';

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClubRole" ADD CONSTRAINT "UserClubRole_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClubRole" ADD CONSTRAINT "UserClubRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRole" ADD CONSTRAINT "ClubRole_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRole" ADD CONSTRAINT "ClubRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
