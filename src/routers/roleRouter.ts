import { createRole } from "../controllers/roleController";
import { auth } from "../middleware/middleware";
import express from "express";

const router = express.Router();

router.route("/api/create_role").post(auth, createRole);
// router.route("/api/list_roles").get(auth, listRoles);
export default router;
