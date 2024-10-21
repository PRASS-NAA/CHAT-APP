import express from "express";
import { getMessages, sendMessage } from "../controller/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const messagerouter = express.Router();

messagerouter.post("/getmessages", getMessages)
messagerouter.post("/send",sendMessage);

export default messagerouter;