import Comment from "../models/Comment";
import Video from "../models/Video";
import User from "../models/User";
import { getFileUrl, removeFile } from "../util";

// queries (read-list/search/watch)
export const listVideo = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: -1 }).populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const searchVideo = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    })
      .sort({ createdAt: -1 })
      .populate("owner");
  }
  return res.render("videos/search", {
    pageTitle: "Search Video",
    keyword,
    videos,
  });
};

export const readVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("videos/watch", { pageTitle: video.title, video });
};

// mutations (create, update, delete)
export const createVideoView = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload Video" });
};
export const createVideo = async (req, res) => {
  const {
    body: { title, summary, tags, thumbnail },
    session: { user },
    file,
  } = req;
  try {
    if (!title || !summary || !tags) {
      throw new Error("Mandatory fields are required.");
    }
    if (!file) {
      return res.status(400).send("No file to upload.");
    }

    // add video file into storage
    const fileUrl = await getFileUrl(file, "video");

    // add video meta
    const newVideo = await Video.create({
      title,
      summary,
      tags: Video.formatTags(tags),
      thumbnail,
      fileUrl,
      owner: user._id,
    });

    // add videoId into owner
    const userInfo = await User.findById(user._id);
    userInfo.videos.push(newVideo._id);
    userInfo.save();

    return res.redirect("/");
  } catch (error) {
    console.error("Error adding video:", error);
    return res.render("videos/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const updateVideoView = async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(user._id)) {
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit", { pageTitle: `Edit Video`, video });
};
export const updateVideo = async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;

  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(user._id)) {
    return res.status(403).redirect("/");
  }
  const {
    body: { title, summary, tags, thumbnail },
    file,
  } = req;

  // add new video file into storage
  const fileUrl = file && (await getFileUrl(file, "video"));

  // modify video meta
  await Video.findByIdAndUpdate(id, {
    title,
    summary,
    tags: Video.formatTags(tags),
    thumbnail,
    fileUrl,
    updatedAt: Date.now(),
  });

  // remove old video file from storage
  if (video.fileUrl && process.env.MODE === "OPS") {
    const fileName = video.fileUrl.split("/").pop();
    await removeFile(fileName, "video");
  }
  return res.redirect("/");
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(user._id)) {
    return res.status(403).redirect("/");
  }

  // remove video file from storage
  if (video.fileUrl && process.env.MODE === "OPS") {
    const fileName = video.fileUrl.split("/").pop();
    await removeFile(fileName, "video");
  }

  // remove videoId from owner
  await User.findByIdAndUpdate(user._id, {
    $pull: { videos: id },
  });

  // remove video
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

// mutations for api routes
export const updateVideoHit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.hits = video.hits + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { content },
    params: { id },
  } = req;

  // add comment
  const comment = await Comment.create({
    content,
    owner: user._id,
    video: id,
  });

  // add commentId into video
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.comments.push(comment._id);
  video.save();

  // add commentId into owner
  const owner = await User.findById(user._id);
  owner.comments.push(comment._id);
  owner.save();

  return res.status(201).send({ newCommentId: comment._id });
};

export const updateComment = async (req, res) => {
  const {
    session: { user },
    body: { id: commentId, content },
    params: { id: videoId },
  } = req;

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).render("404", { pageTitle: "Comment not found." });
  }
  if (String(comment.owner) !== String(user._id)) {
    return res.status(403).redirect("/");
  }

  // modify comment
  await Comment.findByIdAndUpdate(commentId, {
    content,
  });
  return res.sendStatus(200);
};

export const deleteComment = async (req, res) => {
  const {
    session: { user },
    body: { id: commentId },
    params: { id: videoId },
  } = req;

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).render("404", { pageTitle: "Comment not found." });
  }
  if (String(comment.owner) !== String(user._id)) {
    return res.status(403).redirect("/");
  }

  // remove commentId from owner
  await User.findByIdAndUpdate(user._id, {
    $pull: { comments: commentId },
  });

  // remove commentId from video
  video.comments = video.comments.filter((id) => id !== commentId);
  video.save();

  // remove comment
  await Comment.findByIdAndDelete(commentId);
  return res.status(204).end();
};
