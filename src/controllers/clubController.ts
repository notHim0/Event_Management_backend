import { PrismaClient, Club, Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { clubSchema } from "../../utils/zodSchema";
// import { createPresident, initializeMember } from "./roleController";

const prisma = new PrismaClient();

export async function createClub(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const formData: FormData = req.body;
  try {
    const club: Club = await prisma.club.findFirst({
      where: {
        name: formData["name"],
      },
    });

    if (!club) {
      // RoleID for presidenRole;
      const presideRoleID = uuidv4();

      //validate the user inputed data
      const data = clubSchema.parse({
        name: formData["name"],
        description: formData["description"],
        instituteName: formData["instituteName"],
      });

      //Creates CLub and Initializes it with generic Roles
      const newClub: Club = await prisma.club.create({
        data: {
          name: formData["name"],
          description: formData["description"],
          instituteName: formData["instituteName"],
          ClubRole: {
            create: [
              {
                role: {
                  create: {
                    roleName: "President",
                    id: presideRoleID,
                    accessLevel: 100,
                  },
                },
              },
              {
                role: {
                  create: {
                    roleName: "Member",
                    accessLevel: 1,
                  },
                },
              },
            ],
          },
        },
      });

      // Assigns President Pole to User
      await prisma.userClubRole.create({
        data: {
          clubId: newClub.id,
          userId: req.body["userInfo"].id,
          roleId: presideRoleID,
        },
      });

      return res.status(200).json({
        status: "success",
        data: { code: "CLUB_CREATED" },
        errror: null,
      });
    }

    return res.status(409).json({
      status: "error",
      error: { code: "CLUB_ALREADY_EXISTS" },
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: { code: "INTERNAL_SERVER_ERROR" },
      data: null,
    });
  }
}

export async function listAllClubs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const formdata: FormData = req.body;
  console.log(req.body.userInfo);
  try {
    const clubs = await prisma.club.findMany({
      where: {
        instituteName: req.body["userInfo"].instituteName,
      },
    });

    res.status(201).json({
      status: "success",
      error: null,
      data: { code: "CLUB_LIST", clubs: clubs },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      error: { code: "INTERNAL_SERVER_ERROR" },
      data: null,
    });
  }
}

export async function joinClub(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { clubId } = req.params;

    const { roleId } = await prisma.clubRole.findFirst({
      where: {
        clubId,
        role: {
          roleName: "Member",
        },
      },

      select: {
        roleId: true,
      },
    });

    await prisma.userClubRole.create({
      data: {
        userId: req.body["serInfo"].id,
        clubId,
        roleId,
      },
    });

    return res.status(200);
  } catch (error) {}
}

export async function addMembers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId, clubId } = req.body;

  const { roleId } = await prisma.clubRole.findFirst({
    where: { clubId, role: { roleName: "Member" } },
    select: {
      roleId: true,
    },
  });

  try {
    if (!roleId) throw new Error("UNABLE TO ADD MEMBER");

    await prisma.userClubRole.create({
      data: {
        clubId,
        roleId,
        userId,
      },
    });

    const user = await prisma.user.update({
      where: {
        collegeRegistrationID: userId,
      },
      data: {
        clubsAndRoles: {
          connect: { clubId_userId_roleId: { clubId, userId, roleId } },
        },
      },
    });
    if (!user) throw new Error("patch not completed");

    res.status(200).json({
      status: "success",
      error: null,
      data: { code: "MEMBER_ADDED", message: "NEW MEMBER ADDED" },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      error: { code: "INTERNAL_SERVER_ERROR" },
      data: null,
    });
  }
}

export async function assignRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { clubId, userId, roleId } = req.body;

  try {
    const validUsers = await Promise.all(
      await userId.map(async (user) => {
        return await prisma.user.findUnique({
          where: {
            collegeRegistrationID: user,
          },
          select: {
            collegeRegistrationID: true,
          },
        });
      })
    );

    if (!validUsers) throw new Error("INVALID_USERS");

    await Promise.all(
      await validUsers.map(async (user) => {
        return await prisma.userClubRole.create({
          data: {
            clubId,
            userId: user.collegeRegistrationID,
            roleId,
          },
        });
      })
    );
    res.status(200).json({
      status: "success",
      error: null,
      data: {
        code: "ROLE_ASSIGNED",
        message: "ROLES ASSIGNED TO SELECTED MEMBERES",
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      error: { code: "INTERNAL_SERVER_ERROR" },
      data: null,
    });
  }
}
