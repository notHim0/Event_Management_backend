import { PrismaClient, Event } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { eventSchema } from "../utils/zodSchema";

const prisma = new PrismaClient();

export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const formData: FormData = req.body;
  try {
    const data: any = eventSchema.parse({
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

export async function searchEventByParam(req, res, next) {
  const searchParam = req.body;
  try {
    const eventByParam: Event = await prisma.event.findUnique({
      where: searchParam,
    });

    console.dir(eventByParam, { depth: null });

    res.status(200).json({
      status: "success",
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
