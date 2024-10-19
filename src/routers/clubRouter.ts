import {
  addMembers,
  assignRole,
  createClub,
  joinClub,
  listAllClubs,
  removeMember,
  unassignRole,
} from "../controllers/clubController";
import { auth, checkAccessLevel } from "../middleware/middleware";
import express from "express";

const router = express.Router();

router.route("/api/create_club").post(auth, createClub);
router.route("/api/list_all_clubs").get(auth, listAllClubs);
router.route("/api/club/:clubID/join").post(auth, joinClub);
router.route("/api/club/add_members").post(auth, checkAccessLevel, addMembers);
router.route("/api/club/assign_role").post(auth, checkAccessLevel, assignRole);
router
  .route("/api/club/remove_member")
  .delete(auth, checkAccessLevel, removeMember);
router
  .route("/api/club/remove_role")
  .delete(auth, checkAccessLevel, unassignRole);
export default router;
