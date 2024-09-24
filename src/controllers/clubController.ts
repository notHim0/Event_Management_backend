import { PrismaClient, Club } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { clubSchema } from "../../utils/zodSchema";
const prisma = new PrismaClient();

export async function createClub(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const formData: FormData = req.body;

  try {
    const data: any = clubSchema.parse({
      name: formData["name"],
      members: formData["members"],
      description: formData["description"],
      acheivements: formData["acheivements"],
    });

    await prisma.club.create({
      data,
    });
    res.status(201).json({
      status: "success",
      error: null,
      data: { code: "CLUB_CREATED", message: "CLUB SUCCESSFULLY CREATED" },
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
