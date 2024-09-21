import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export async function createEvent(req, res, next) {
  const formData: FormData = req.body;

  const schema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    venue: z.string().min(1),
    club_organisers: z.string().nullable().optional(),
    members: z.string().nullable().optional(),
    description: z.string(),
    thumbnail: z.string().nullable().optional(),
    timeStamp: z.string().nullable().optional(),
  });

  const data: any = schema.parse({
    name: formData["name"],
    type: formData["type"],
    venue: formData["venue"],
    club_organisers: formData["club_organisers"],
    members: formData["members"],
    description: formData["description"],
    thumbnail: formData["thumbnail"],
    timestamp: formData["timestamp"],
  });

  try {
    await prisma.event.create({
      data,
    });
    res.status(201).send(data);
  } catch (e) {
    res.status(404).send({ e });
  }
}
