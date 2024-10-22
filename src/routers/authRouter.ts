import express from "express";
import { auth } from "../middleware/middleware";
import { login, signup } from "../controllers/authController";
import tryCatch from "../utils/tryCatch"
const router = express.Router();


router.route("/api/signup").post(tryCatch(signup));
router.route("/api/login").post(tryCatch(login));

export default router;
