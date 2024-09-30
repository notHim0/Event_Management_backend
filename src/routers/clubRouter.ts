import {
  addMembers,
  assignRole,
  createClub,
  listAllClubs,
} from "../controllers/clubController";
import { auth, checkAccessLevel } from "../middleware/middleware";
import express from "express";

const router = express.Router();

router.route("/api/create_club").post(auth, createClub);
router.route("/api/list_all_clubs").get(listAllClubs);
router.route("/api/club/add_members").patch(auth, addMembers);
router.route("/api/club/assign_role").post(assignRole);

export default router;
