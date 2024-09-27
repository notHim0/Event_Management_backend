import { PrismaClient } from "@prisma/client";
import express, { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export async function listUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await prisma.user.findMany();

    if (!users) {
      throw new Error("USERS NOT FOUND");
    }
    console.dir(users, { depth: null });

    res.status(200).json({
      status: "success",
      error: null,
      data: { code: "USERS_FETCHED" },
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
