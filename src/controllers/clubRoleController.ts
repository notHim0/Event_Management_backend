// import { PrismaClient, ClubRole, Club } from "@prisma/client";
// import { NextFunction, Request, Response } from "express";
// import { clubRoleSchema } from "../../utils/zodSchema";

// const prisma = new PrismaClient();

// export default async function createClubRole(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { clubId, roleId, userId } = req.body;

//   try {
//     const data = clubRoleSchema.parse({
//       clubId,
//       roleId,
//       userId,
//     });

//     const clubRole = await prisma.clubRole.create({
//       data: { clubId, roleId, userId },
//     });

//     console.dir(clubRole, { depth: null });

//     res.status(201).json({
//       status: "success",
//       error: null,
//       data: {
//         code: "ADDED_CLUBROLE",
//       },
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       status: "error",
//       error: { code: "INTERNAL_SERVER_ERROR" },
//       data: null,
//     });
//   }
// }
