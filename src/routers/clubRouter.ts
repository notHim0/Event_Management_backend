import {
  addMembers,
  // addMembers,
  assignRole,
  createClub,
  joinClub,
  listAllClubs,
} from "../controllers/clubController";
import { auth } from "../middleware/middleware";
import express from "express";

const router = express.Router();

router.route("/api/create_club").post(auth, createClub);
router.route("/api/list_all_clubs").get(auth, listAllClubs);
router.route("/api/club/:clubID/join").post(auth, joinClub);
router.route("/api/club/add_members").patch(auth, addMembers);
router.route("/api/club/assign_role").post(assignRole);

export default router;
