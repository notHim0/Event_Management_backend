import { PrismaClient, Club } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { clubSchema } from "../../utils/zodSchema";
import { createPresident } from "./roleController";
const prisma = new PrismaClient();

export async function createClub(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, members, description, acheivements, userId } = req.body;

  try {
    const data: any = clubSchema.parse({
      name,
      members,
      description,
      acheivements,
    });

    const club = await prisma.club.create({
      data,
    });

    console.dir(club, { depth: null });

    createPresident(userId, club.id);

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

export async function listAllClubs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const clubs = await prisma.club.findMany();

    console.dir(clubs, { depth: null });

    res.status(201).json({
      status: "success",
      error: null,
      data: { code: "CLUBS_LISTED", message: "ALL CLUBS LISTED" },
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
