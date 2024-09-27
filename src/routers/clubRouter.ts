import { createClub, listAllClubs } from "../controllers/clubController";
import { auth } from "../middleware/middleware";
import express from "express";

const router = express.Router();

router.route("/api/create_club").post(auth, createClub);
router.route("/api/list_all_clubs").get(listAllClubs);

export default router;
