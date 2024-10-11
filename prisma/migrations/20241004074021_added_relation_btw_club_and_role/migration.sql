-- CreateTable
CREATE TABLE "ClubRole" (
    "clubId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "ClubRole_pkey" PRIMARY KEY ("clubId","roleId")
);

-- AddForeignKey
ALTER TABLE "ClubRole" ADD CONSTRAINT "ClubRole_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRole" ADD CONSTRAINT "ClubRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
