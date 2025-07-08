import express from "express";

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  res.status(200).send({ pageTitle: "Hello, Wetube!" });
});

export default rootRouter;
