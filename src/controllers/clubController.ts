import { PrismaClient, Club, Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { clubSchema } from "../utils/zodSchema";
import AppError from "../AppError";

const prisma = new PrismaClient();

export async function createClub(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, description } = req.body;

  const club: Club = await prisma.club.findFirst({
    where: {
      name: name,
    },
  });

  if (!club) {
    // RoleID for presidenRole;
    const presideRoleID = uuidv4();

    //validate the user inputed data
    const data: any = clubSchema.parse({
      name: name,
      description: description,
      instituteName: req.body.userInfo["instituteName"],
    });

    //Creates CLub and Initializes it with generic Roles
    const newClub: Club = await prisma.club.create({
      data: {
        ...data,
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

    // Assigns President Role to User
    await prisma.userClubRole.create({
      data: {
        clubId: newClub.name,
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

  throw new AppError("A club with this name already exists", "CLUB_ALREADY_EXISTS", 409);

}

export async function listAllClubs(
  req: Request,
  res: Response,
  next: NextFunction
) {

  console.log("listing all clubs");

  const clubs = await prisma.club.findMany({
    where: {
      instituteName: req.body["userInfo"].instituteName,
    },
  });


  res.status(200).json({
    status: "success",
    error: null,
    data: { code: "CLUB_LIST", clubs: clubs },
  });

}

export async function listAllJoinedClubs(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const clubs = await prisma.userClubRole.findMany({
    where: {
      userId: req.body["userInfo"].id,
    },
    select: {
      club: true,
      role: true,
    }
  });

  res.status(200).json({
    status: "success",
    error: null,
    data: { code: "CLUB_LIST", clubs: clubs },
  });

}

export async function joinClub(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { clubId } = req.query;
  clubId = clubId as string;

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

  if (!roleId) throw new AppError("Unable to join the club", "UNABLE_TO_JOIN_CLUB", 404);

  await prisma.userClubRole.create({
    data: {
      userId: req.body["userInfo"].id,
      clubId,
      roleId,
    },
  });

  return res.status(200).json({
    status: "success",
    data: { code: "SUCCESFULLY_JOINED_CLUB" },
    error: null,
  });


}

export async function leaveCLub(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const clubId = req.query.clubId.toString();


  await prisma.userClubRole.deleteMany({
    where: {
      userId: req.body["userInfo"].id,
      clubId: clubId,
    },
  });

  return res.status(200).json({
    status: "success",
    data: { code: "SUCCESFULLY_LEFT_CLUB" },
    error: null,
  });


}

export async function addMembers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //ids for querying
  let { clubId } = req.query;
  clubId = clubId as string;


  const userId = req.body.userInfo.id;
  //be sure to also send the roleId since this is a protected route

  //destructuring the roleId, since that is all we need from the role model
  const { roleId } = await prisma.clubRole.findFirst({
    where: { clubId, role: { roleName: "Member" } },
    select: {
      roleId: true,
    },
  });


  if (!roleId) throw new AppError("Unable to add member", "MEMBER_DOESN'T_EXSIST", 404);

  //creating an entry in the junction table for the new member
  await prisma.userClubRole.create({
    data: {
      clubId,
      roleId,
      userId,
    },
  });

  res.status(200).json({
    status: "success",
    error: null,
    data: { code: "MEMBER_ADDED", message: "NEW MEMBER ADDED" },
  });


}

export async function assignRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { clubId, userId, roleId } = req.body;
  /*
    * userId here is an array of all the users that you want 
      assign roles 

    * be sure to send the roleId as a query since this is a protected route
  */
  try {
    //we first check if the user IDs are valid users
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

    //now we assign roles and create a entry in our junction table
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

export async function removeMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { clubId, userId } = req.body;

  try {
    await prisma.userClubRole.deleteMany({
      where: {
        clubId,
        userId,
      },
    });

    res.status(200).json({
      status: "success",
      error: null,
      data: {
        code: "MEMBER_REMOVED",
        message: "CLUB MEMBER REMOVED FROM CLUB",
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

export async function unassignRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { clubId, userId, roleId } = req.body;

  // be sure to send the roleId as a query since this is a protected route

  try {
    //we first check if the user ID is a valid user
    const validUser = await prisma.user.findUnique({
      where: { collegeRegistrationID: userId },
    });

    if (!validUser) throw new Error("INVALID_USERS");

    //now we delete this record from our junction table
    await prisma.userClubRole.delete({
      where: {
        clubId_userId_roleId: {
          clubId,
          roleId,
          userId,
        },
      },
    });

    res.status(200).json({
      status: "success",
      error: null,
      data: {
        code: "ROLE_UNASSIGNED",
        message: "ROLE WAS REMOVED FROM SELECTED MEMBER",
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

export async function update() { }
