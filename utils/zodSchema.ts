import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  venue: z.string().min(1),
  club_organisers: z.string().nullable().optional(),
  members: z.string().nullable().optional(),
  description: z.string(),
  thumbnail: z.string().nullable().optional(),
  timestamp: z.string().nullable().optional(),
});

export const clubSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const clubRoleSchema = z.object({
  clubId: z.string().min(1),
  roleId: z.string().min(1),
  userId: z.string().min(1),
});

export const roleSchema = z.object({
  roleName: z.string().min(1),
  accessLevel: z.number(),
  clubId: z.string().min(1),
});
