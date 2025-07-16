import express from "express";

import {
  createVideo,
  createVideoView,
  readVideo,
  updateVideo,
  updateVideoView,
  deleteVideo,
} from "../controllers/videoController";
import { fileUpload, protector } from "../middlewares";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(protector)
  .get(createVideoView)
  .post(fileUpload("videos", 10).single("video"), createVideo);
videoRouter.route("/:id([0-9a-f]{24})").get(readVideo);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protector)
  .get(updateVideoView)
  .post(fileUpload("videos", 10).single("video"), updateVideo);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protector).get(deleteVideo);

export default videoRouter;
