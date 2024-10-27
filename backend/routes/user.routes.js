import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar,addUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/getsidebar", getUsersForSidebar);
router.post("/addcontact",protectRoute,addUser);

export default router;
