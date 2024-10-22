import { PrismaClient, Role, ClubRole } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { roleSchema } from "../utils/zodSchema";

const prisma = new PrismaClient();

export async function createRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { roleName, accessLevel, clubId } = req.body;

  try {
    //validating user data
    const data = roleSchema.parse({
      roleName,
      accessLevel,
    });

    //creating role
    const role = await prisma.role.create({
      data: { roleName, accessLevel },
    });

    //adding the role in junction table
    await prisma.clubRole.create({
      data: {
        clubId,
        roleId: role.id,
      },
    });

    console.dir(role);

    res.status(200).json({
      status: "success",
      error: null,
      data: { code: "ROLE_CREATED" },
    });
  } catch (error) {
    console.error(error);

    res.status(501).json({
      status: "error",
      error: { code: "INTERNAL_ERROR" },
      data: null,
    });
  }
}

export async function listRoles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { clubId } = req.body;
  try {
    //getting the list of role IDs in the club
    const rolesId = await prisma.clubRole.findMany({
      where: {
        clubId,
      },
      select: {
        roleId: true,
      },
    });

    //fetching their data
    const roles = await Promise.all(
      rolesId.map(async (role) => {
        return await prisma.role.findFirst({
          where: { id: role.roleId },
          select: {
            roleName: true,
            accessLevel: true,
          },
        });
      })
    );

    console.dir(roles);

    res.status(200).json({
      status: "success",
      error: null,
      data: { code: "ROLES_LISTED", message: "ALL ROLES LISTED" },
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
