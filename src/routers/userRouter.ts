import express from "express";
import { checkAccessLevel, protectedRoutes } from "../middleware/middleware";
import { editProfile } from "../controllers/userController";

const router = express.Router();

router
  .route("/api/user/:userID/edit_profile")
  .get(protectedRoutes, checkAccessLevel(2), editProfile);

export default router;
