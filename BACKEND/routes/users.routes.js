import express from "express";
import { getUsers } from "../controller/users.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { addUser } from "../controller/users.controller.js";

const router = express.Router();

router.get("/getsidebar",getUsers);

router.post("/adduser",addUser);

export default router;