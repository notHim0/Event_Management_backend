import { createRole, listRoles } from "../controllers/roleController";
import { auth, checkAccessLevel } from "../middleware/middleware";
import express from "express";

const router = express.Router();

router.route("/api/create_role").post(auth, checkAccessLevel, createRole);
router.route("/api/list_roles").get(auth, checkAccessLevel, listRoles);
export default router;
