import express from "express";
import {
  createEvent,
  listEvents,
  searchEventById,
} from "../controllers/eventController";

const router = express.Router();

router.route("/api/create_event").post(createEvent);

router.route("/api/list_event").get(listEvents);

router.route("/api/list_event_id").get(searchEventById);

export default router;
