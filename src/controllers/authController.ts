import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
const prisma = new PrismaClient();

export async function signup(req: Request, res: Response) {
  const formData: FormData = req.body;

  try {
    const isRegistered = await prisma.user.findUnique({
      where: { collegeRegistrationID: formData["collegeRegistrationID"] },
    });

    if (!isRegistered) {
      const hashedPassword = await bcrypt.hash(
        formData["password"],
        parseInt(process.env.SALT_ROUNDS)
      );

      await prisma.user.create({
        data: {
          collegeRegistrationID: formData["collegeRegistrationID"],
          firstName: formData["firstName"],
          lastName: formData["lastName"] ? formData["lastName"] : null,
          instituteName: formData["instituteName"],
          degree: formData["degree"],
          course: formData["course"],
          password: hashedPassword,
        },
      });

      res.status(200).json({
        status: "success",
        error: null,
        data: { code: "USER_REGISTERED" },
      });
    } else {
      res.status(409).json({
        status: "error",
        error: {
          code: "USER_ALREADY_EXISTS",
        },
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      error: { code: "INTERNAL_SERVER_ERROR" },
      data: null,
    });
  }
}

export async function login(req: Request, res: Response) {
  const formData: FormData = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        collegeRegistrationID: formData["collegeRegistrationID"],
      },
      include: {
        clubsAndRoles: {
          include: { club: true, role: true },
        },
      },
    });

    console.log(user);
    if (user) {
      // If user exists
      const result = await bcrypt.compare(formData["password"], user.password);
      delete user.password;

      if (result) {
        // If correct crendentials
        const token = jwt.sign(
          {
            registrationID: user.collegeRegistrationID,
          },
          process.env.SECRET,
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
      } else {
        // If wrong password
        return res.status(401).json({
          status: "error",
          error: {
            code: "WRONG_CREDENTIAL",
          },
          data: null,
        });
      }
    } else {
      // If wrong regestrationID
      return res.status(401).json({
        status: "error",
        error: {
          code: "WRONG_CREDENTIAL",
        },
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      error: { code: "INTERNAL_SERVER_ERROR" },
      data: null,
    });
  }
}
