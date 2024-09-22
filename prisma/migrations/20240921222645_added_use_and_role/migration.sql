-- CreateTable
CREATE TABLE "Role" (
    "roleName" TEXT NOT NULL DEFAULT 'student',
    "accessLevel" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleName")
);

-- CreateTable
CREATE TABLE "User" (
    "collegeRegistrationID" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "instituteName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "roleName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("collegeRegistrationID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleName_fkey" FOREIGN KEY ("roleName") REFERENCES "Role"("roleName") ON DELETE RESTRICT ON UPDATE CASCADE;
