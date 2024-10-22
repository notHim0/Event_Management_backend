import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1, ""),
  type: z.string().min(1),
  venue: z.string().min(1),
  club_organisers: z.string().nullable().optional(),
  members: z.string().nullable().optional(),
  description: z.string(),
  thumbnail: z.string().nullable().optional(),
  timestamp: z.string().nullable().optional(),
});

export const clubSchema = z.object({
  name: z.string().min(1, "This field is required"),
  description: z.string().min(1, "This field is required"),
  instituteName: z.string().min(1, "This field is required"),
});

export const clubRoleSchema = z.object({
  clubId: z.string().min(1),
  roleId: z.string().min(1),
  userId: z.string().min(1),
});

export const roleSchema = z.object({
  roleName: z.string().min(1),
  accessLevel: z.number(),
});

export const userSchema = z.object({
  collegeRegistrationID: z.string().min(1, "This field can't be empty"),
  firstName: z.string().min(1, "This field can't be empty"),
  lastName: z.string().optional(),
  password: z.string().min(6, "The password must be at 6 characters long"),
  instituteName: z.string().min(3, "Enter a valid institute name"),
  degree: z.string().min(1, "This field can't be emtpy"),
  course: z.string().min(1, "This field can't be emtpy"),
  email: z.string().email("Enter a valid email").optional(),
  phone: z.number().optional()
})
