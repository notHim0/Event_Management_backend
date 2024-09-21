import express from "express";
import { createEvent } from "../controllers/eventController";

const router = express.Router();

console.log("this is atleast running");

router.route("/api/create_event").post(createEvent);

export default router;
