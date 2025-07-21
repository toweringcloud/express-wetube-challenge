import express from "express";

import {
  createComment,
  deleteComment,
  updateComment,
  updateVideoHit,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.put("/videos/:id([0-9a-f]{24})/comment", updateComment);
apiRouter.delete("/videos/:id([0-9a-f]{24})/comment", deleteComment);
apiRouter.post("/videos/:id([0-9a-f]{24})/view", updateVideoHit);

export default apiRouter;
