import express from "express";

import { githubLogin, githubCallback } from "../controllers/githubController";
import {
  signup,
  signupView,
  signin,
  signinView,
  signout,
} from "../controllers/userController";
import { protector, publicOnly } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  return res.render("home", { pageTitle: "Hello, Wetube!" });
});
rootRouter.route("/join").all(publicOnly).get(signupView).post(signup);
rootRouter.route("/login").all(publicOnly).get(signinView).post(signin);
rootRouter.get("/logout", protector, signout);
rootRouter.get("/github", publicOnly, githubLogin);
rootRouter.get("/github/callback", publicOnly, githubCallback);

export default rootRouter;
