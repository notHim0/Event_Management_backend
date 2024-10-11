/*
  Warnings:

  - You are about to drop the column `acheivements` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `members` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `clubId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the `ClubRole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `instituteName` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instituteName` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_deadline` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_limit` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClubRole" DROP CONSTRAINT "ClubRole_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubRole" DROP CONSTRAINT "ClubRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "ClubRole" DROP CONSTRAINT "ClubRole_userId_fkey";

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "acheivements",
ADD COLUMN     "club_banner" TEXT,
ADD COLUMN     "club_logo" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "instituteName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "members",
DROP COLUMN "timestamp",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "instituteName" TEXT NOT NULL,
ADD COLUMN     "registration_deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "registration_limit" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "clubId",
ALTER COLUMN "roleName" SET DEFAULT 'member';

-- DropTable
DROP TABLE "ClubRole";

-- CreateTable
CREATE TABLE "Rounds" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "venue" TEXT,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserClubRole" (
    "clubId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserClubRole_pkey" PRIMARY KEY ("clubId","userId")
);

-- CreateTable
CREATE TABLE "UserEvent" (
    "userID" TEXT NOT NULL,
    "eventID" TEXT NOT NULL,

    CONSTRAINT "UserEvent_pkey" PRIMARY KEY ("userID","eventID")
);

-- AddForeignKey
ALTER TABLE "Rounds" ADD CONSTRAINT "Rounds_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClubRole" ADD CONSTRAINT "UserClubRole_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClubRole" ADD CONSTRAINT "UserClubRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClubRole" ADD CONSTRAINT "UserClubRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("collegeRegistrationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("collegeRegistrationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
