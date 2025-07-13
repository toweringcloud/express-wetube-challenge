import Video from "../models/Video";
import User from "../models/User";

// queries (read-list/search/watch)
export const listVideo = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: -1 });
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
    });
    console.log(keyword, videos);
  }
  return res.render("videos/search", {
    pageTitle: "Search Video",
    keyword,
    videos,
  });
};

export const readVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
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
    const newVideo = await Video.create({
      title,
      summary,
      tags: Video.formatTags(tags),
      thumbnail,
      fileUrl: file ? file.path : undefined,
      owner: user._id,
    });
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
  await Video.findByIdAndUpdate(id, {
    title,
    summary,
    tags: Video.formatTags(tags),
    thumbnail,
    fileUrl: file ? file.path : undefined,
    updatedAt: Date.now(),
  });
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
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

// mutations for api routes
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.hits = video.hits + 1;
  await video.save();
  return res.sendStatus(200);
};
