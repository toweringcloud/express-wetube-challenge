import express from "express";

import {
  readProfile,
  updateProfile,
  updateProfileView,
  changePassword,
  changePasswordView,
} from "../controllers/userController";
import { fileUpload, protector } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/:id([0-9a-f]{24})", readProfile);
userRouter
  .route("/edit")
  .all(protector)
  .get(updateProfileView)
  .post(fileUpload("avatars", 3).single("avatar"), updateProfile);
userRouter
  .route("/change-pw")
  .all(protector)
  .get(changePasswordView)
  .post(changePassword);

export default userRouter;
