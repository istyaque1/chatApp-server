import express from "express";
import { getMessages, sendMessage } from "../controller/message.controller.js";
import protedtedRoute from "./protectedRoute.js";

const router = express.Router();

router.post("/send/message/:id", protedtedRoute, sendMessage);
router.get("/get/message/:id", protedtedRoute, getMessages);

export default router;
