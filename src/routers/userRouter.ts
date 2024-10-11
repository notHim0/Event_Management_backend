import express from "express";
// import { checkAccessLevel, auth } from "../middleware/middleware";
import { listUsers } from "../controllers/userController";

const router = express.Router();

// router
//   .route("/api/user/:userID/edit_profile")
//   .get(protectedRoutes, checkAccessLevel(2), editProfile);

router.route("/api/list_users").get(listUsers);

export default router;
