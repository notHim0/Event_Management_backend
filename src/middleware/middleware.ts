import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt, { decode } from "jsonwebtoken";

const prisma = new PrismaClient();

export async function protectedRoutes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await prisma.user.findUnique({
      where: {
        collegeRegistrationID: decoded["registrationID"],
      },
    });

    if (!user) throw new Error("INTERNAL_ERROR");

    req.body.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        error: {
          code: "SESSION_EXPIRED",
          message: "Your session has expired. Please log in again.",
        },
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        error: {
          code: "INVALID_TOKEN",
          message: "The token provided is invalid.",
        },
      });
    }
    res.status(401).json({
      status: "error",
      error: {
        code: "AUTH_FAILED",
        message: "Authorization failed.",
      },
    });
  }
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
