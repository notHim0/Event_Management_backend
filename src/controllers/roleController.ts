import { PrismaClient, Role, ClubRole } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { roleSchema } from "../../utils/zodSchema";

const prisma = new PrismaClient();

export async function createRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { roleName, accessLevel } = req.body;

  try {
    const data = roleSchema.parse({
      roleName,
      accessLevel,
    });
    const role = await prisma.role.create({
      data,
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
  try {
    const roles = await prisma.role.findMany();

    console.dir(roles, { depth: null });

    res.status(201).json({
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
export async function createPresident(userId, clubId) {
  const role = await prisma.role.create({
    data: {
      roleName: "President",
      accessLevel: 4,
      clubs: {
        create: { userId, clubId },
      },
    },
  });
}
