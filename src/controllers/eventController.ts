import { PrismaClient, Event } from "@prisma/client";
import { NextFunction, response } from "express";
import { AnyZodObject, EnumValues, z } from "zod";

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
    timestamp: z.string().nullable().optional(),
  });

  try {
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
    await prisma.event.create({
      data,
    });
    res.status(201).send(data);
  } catch (e) {
    res.status(404).send({ message: e });
  }
}

export async function listEvents(req, res, next) {
  try {
    const events: Event[] = await prisma.event.findMany();

    if (!events) {
      throw new Error("no events to list");
    }

    console.dir(events, { depth: null });

    res.status(200).send(events);
  } catch (e) {
    res.status(404).send({ e });
  }
}

export async function searchEventById(req, res, next) {
  const searchParam = req.body;
  try {
    const eventById: Event = await prisma.event.findUnique({
      where: { id: searchParam.id },
    });

    console.dir(eventById, { depth: null });

    res.status(200).send(eventById);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}
