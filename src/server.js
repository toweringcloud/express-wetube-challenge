import express from "express";
import favicon from "serve-favicon";
import flash from "express-flash";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import MongoStore from "connect-mongo";

import apiRouter from "./routers/apiRouter";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();

// Templating Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Logger & Options
const logger = morgan("dev");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie Session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  })
);
app.use(flash());
app.use(localsMiddleware);

// Static Routes
// app.use(express.static("/public"));
app.use(favicon(path.join(__dirname, "../public", "favicon.png")));
app.use("/upload", express.static("files"));
app.use("/static", express.static("assets"));

// Dynamic Routes
app.use("/", rootRouter);
app.use("/api", apiRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
