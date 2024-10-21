import express from "express";
import {signup,login,logout,verifymail,deleteUser} from "../controller/auth.controller.js"

const router = express.Router();

router.post("/signup", signup);

router.post("/login",login);

router.post("/logout",logout);

router.post("/verify-email", verifymail);

router.post("/delete-user", deleteUser);

export default router;
