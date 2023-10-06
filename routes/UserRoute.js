import express from "express";
import  { changePasswordHandler, getAllUserHandler, loginHandler, sendForgetPasswordTokenHandler, signupHandler, updateUserHandler } from "../Controller/userController.js";

const router = express.Router();

router.post("/login",loginHandler);
router.post("/signup",signupHandler);

router.post("/change-password",changePasswordHandler)
router.post("/forgot-password",sendForgetPasswordTokenHandler);

router.put("/update-user/:userId",updateUserHandler)

router.get("/all-users",getAllUserHandler);

export default router;