import { PrismaClient, User } from "@prisma/client";
import { NextFunction, query, Request, Response } from "express";
import jwt, { decode } from "jsonwebtoken";

//importing route access levels
import routesAccessLevels from "../../utils/routeAccessLevels";

const prisma = new PrismaClient();

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    //extracting the jwt token form header
    const token = req.header("Authorization");

    //verifying the token
    const decoded = jwt.verify(token, process.env.SALT_ROUNDS);

    //verifying the user
    const user = await prisma.user.findUnique({
      where: {
        collegeRegistrationID: decoded["registrationID"],
      },
    });

    if (!user) throw new Error("INTERNAL_ERROR");

    //appending data to body for later use
    req.body.userInfo = {
      id: user.collegeRegistrationID,
      instituteName: user.instituteName,
    };

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

    return res.status(401).json({
      status: "error",
      error: {
        code: "AUTH_FAILED",
        message: "Authorization failed.",
      },
    });
  }
}

export async function checkAccessLevel(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //extracting data
  const clubId = req.query.clubId.toString();
  const userId = req.body.userInfo.id;
  const { roleId } = req.body;

  try {
    //verifying the role to check access level
    const clubRole = await prisma.userClubRole.findFirst({
      where: {
        clubId,
        userId,
        roleId,
      },
    });

    if (!clubRole) throw new Error("ACCESS DENIED");

    const role = await prisma.role.findUnique({
      where: {
        id: clubRole.roleId,
      },
    });
    if (!role) throw new Error("ACCESS DENIED");

    //checking accessLevel according to route trying to access
    if (role.accessLevel < routesAccessLevels[req.route.path])
      throw new Error("ACCESS_DENIED");

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      status: "error",
      error: {
        code: "ACCESS_DENIED",
      },
      data: null,
    });
  }
}
