import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
const router = express.Router();

const prisma = new PrismaClient();

router.post("/signup", async (req, res) => {
  const formData: FormData = req.body;
  console.log(req.body);

  try {
    if (
      !(await prisma.user.findUnique({
        where: { collegeRegistrationID: formData["collegeRegistrationID"] },
      }))
    ) {
      const hashedPassword = await bcrypt.hash(
        formData["password"],
        parseInt(process.env.SALT_ROUNDS)
      );

      if (
        !(await prisma.role.findUnique({
          where: {
            roleName: "student",
          },
        }))
      ) {
        await prisma.role.create({
          data: {
            roleName: "student",
            accessLevel: 1,
          },
        });
      }
      await prisma.user.create({
        data: {
          collegeRegistrationID: formData["collegeRegistrationID"],
          firstName: formData["firstName"],
          lastName: formData["lastName"] ? formData["lastName"] : null,
          instituteName: formData["instituteName"],
          degree: formData["degree"],
          course: formData["course"],
          password: hashedPassword,
          roleName: "student",
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
    res.status(500).json({
      status: "error",
      error: { code: "INTERNAL_SERVER_ERROR" },
      data: null,
    });
  }
});

router.post("/login", async (req, res) => {
  const formData: FormData = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        collegeRegistrationID: formData["collegeRegistrationID"],
      },
      include: {
        role: true,
      },
    });

    if (user) {
      // If User exists
      const result = await bcrypt.compare(formData["password"], user.password);
      delete user.password;

      if (result) {
        // If correct crendentials

        const token = jwt.sign(
          {
            registrationID: user.collegeRegistrationID,
            accessLevel: user.role.accessLevel,
          },
          process.env.SECRET
        );

        res.status(200).json({
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

        res.status(401).json({
          status: "error",
          error: {
            code: "WRONG_CREDENTIAL",
          },
          data: null,
        });
      }
    } else {
      // If wrong regestrationID

      res.status(401).json({
        status: "error",
        error: {
          code: "WRONG_CREDENTIAL",
        },
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: { code: "INTERNAL_SERVER_ERROR" },
      data: null,
    });
  }
});

export default router;
