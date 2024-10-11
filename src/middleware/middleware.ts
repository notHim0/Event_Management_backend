import { PrismaClient, User } from "@prisma/client";
import { NextFunction, query, Request, Response } from "express";
import jwt, { decode } from "jsonwebtoken";

const prisma = new PrismaClient();

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.SALT_ROUNDS);

    const user = await prisma.user.findUnique({
      where: {
        collegeRegistrationID: decoded["registrationID"],
      },
    });

    if (!user) throw new Error("INTERNAL_ERROR");
    req.body.userInfo = {id : user.collegeRegistrationID, instituteName : user.instituteName};

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

// export async function checkAccessLevel(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const clubId = req.query.clubId.toString();
//   const { userId } = req.body;
  
//   try {
//     const clubRole = await prisma.clubRole.findFirst({
//       where: {
//         clubId,
//         userId,
//       },
//     });

//     if (!clubRole) throw new Error("ACCESS DENIED");

//     const role = await prisma.role.findUnique({
//       where: {
//         id: clubRole.roleId,
//       },
//     });

//     /*

//     use params to specify what action is going to be performed and check accordingly!!

//     //role checking logic to be inserted here!!



//     */
//     if (!role) throw new Error("ACCESS DENIED");

//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({
//       status: "error",
//       error: {
//         code: "ACCESS_DENIED",
//       },
//       data: null,
//     });
//   }
// }
