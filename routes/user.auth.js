import express from "express";
import { userRegister, userLogin ,getUsers} from "../controller/user.auth.controller.js";
import protedtedRoute from "./protectedRoute.js";
import upload from "../multer/multer.js"

const router = express.Router();

router.post("/register", upload.single("photo"),userRegister);
router.post("/login", userLogin);
router.get("/all", protedtedRoute,getUsers)

export default router;
