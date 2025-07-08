import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 50 },
  summary: { type: String, required: true, trim: true, minLength: 20 },
  fileUrl: { type: String },
  thumbUrl: { type: String },
  tags: [{ type: String }],
  hits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatTags", function (tags) {
  return tags.split(",").map((tag) => tag.trim());
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
