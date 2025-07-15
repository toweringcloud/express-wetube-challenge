import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
