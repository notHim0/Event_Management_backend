import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import AppError from "../AppError";
import { userSchema } from "../utils/zodSchema";
import z from "zod";
const prisma = new PrismaClient();

export async function signup(req: Request, res: Response) {
  const { collegeRegistrationID, firstName, lastName, password, instituteName, degree, course } = req.body;

  const isRegistered = await prisma.user.findUnique({
    where: { collegeRegistrationID: collegeRegistrationID },
  });

  if (isRegistered) throw new AppError("User with this registration ID already exists.", "USER_EXSITS", 409);

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS)
  );

  const data: any = userSchema.parse({
    collegeRegistrationID: collegeRegistrationID,
    firstName: firstName,
    lastName: lastName ? lastName : null,
    instituteName: instituteName,
    degree: degree,
    course: course,
    password: hashedPassword,
  })

  await prisma.user.create({
    data
  });

  res.status(200).json({
    status: "success",
    error: null,
    data: { code: "USER_REGISTERED" },
  });
}

export async function login(req: Request, res: Response) {
  const { collegeRegistrationID, password } = req.body;

  const user: User = await prisma.user.findUnique({
    where: {
      collegeRegistrationID: collegeRegistrationID,
    },

    include: {
      clubsAndRoles: {
        select: {
          club: true,
          role: true,
        }
      }
    }
  });

  if (user) {
    // If user exists
    const result = await bcrypt.compare(password, user.password);
    delete user.password;

    if (result) {
      // If correct crendentials
      const token = jwt.sign(
        {
          registrationID: user.collegeRegistrationID,
        },
        process.env.SALT_ROUNDS,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({
        status: "sucess",
        error: null,
        data: {
          code: "SUCESSFULLY_LOGGED_IN",
          value: {
            user: { ...user },
            token: token,
          },
        },
      });
    }
  }
  throw new AppError("Invalid Registration ID or Password. Please check your details and try again.", "WRONG_CREDENTIAL", 401);
}

