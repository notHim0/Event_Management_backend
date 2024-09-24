import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function protectedRoutes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err && typeof err == "object") {
      if (err.name == "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          error: {
            code: "SESSION_EXPIRED",
          },
          data: null,
        });
      }
    }

    req.body.decode = decoded;
    return next();
  });
}

export async function protectedClubRoutes(
  req: Request,
  res: Response,
  next: NextFunction
) {}

export function checkAccessLevel(accessLevel: number) {
  return async function checkAccess(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { clubID } = req.params;
    const { decode } = req.body;

    const user = await prisma.clubRole.findUnique({
      where: {
        clubId_userId: {
          clubId: clubID,
          userId: decode.regestrationID,
        },
      },
    });

    if (user) {
      const role = await prisma.role.findUnique({
        where: {
          id: user.roleId,
        },
      });

      if (role) {
        return next();
      }
    }

    return res.status(401).json({
      status: "error",
      error: {
        code: "ACCESS_DENIED",
      },
      data: null,
    });
  };
}
