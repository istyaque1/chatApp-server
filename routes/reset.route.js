import express from "express";
import { reset , createPassword} from "../controller/reset.controller.js";

const router = express.Router();

router.post("/reset-password", reset)
router.post("/reset", createPassword)

export default router;