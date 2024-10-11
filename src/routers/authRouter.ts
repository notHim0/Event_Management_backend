import express from "express";
import { auth } from "../middleware/middleware";
import { login, signup } from "../controllers/authController";
const router = express.Router();

router.route("/api/signup").post(signup);
router.route("/api/login").post(login);

export default router;
