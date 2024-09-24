import { createClub } from "../controllers/clubController";
import express from "express";

const router = express.Router();

router.route("/api/create_club").post(createClub);

export default router;
