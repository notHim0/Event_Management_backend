import { PrismaClient, Event } from "@prisma/client";
import { NextFunction, response } from "express";
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
    res.status(201).json({
      status: "success",
      error: null,
      data: { code: "EVENT_CREATED", message: "Event successfully created" },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: { code: "INTERNAL_SERVER_ERROR" },
      data: null,
    });
  }
}

export async function listEvents(req, res, next) {
  try {
    const events: Event[] = await prisma.event.findMany();

    if (!events) {
      throw new Error("no events to list");
    }

    console.dir(events, { depth: null });
    res.status(200).json({
      status: "error",
      error: null,
      data: { code: "ALL_EVENTS" },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: { code: "INTERNAL_SERVER_ERROR" },
      data: null,
    });
  }
}

export async function searchEventById(req, res, next) {
  const searchParam = req.body;
  try {
    const eventById: Event = await prisma.event.findUnique({
      where: { id: searchParam.id },
    });

    console.dir(eventById, { depth: null });

    res.status(200).json({
      status: "error",
      error: null,
      data: { code: "FOUND_EVENT" },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: { code: "INTERNAL_SERVER_ERROR" },
      data: null,
    });
  }
}
