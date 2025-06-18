const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true, // Người đăng bài
    },
    text: {type: String, required : true},
    media:[
       {
      url: {type: String},
      type: {
        type: String,
        enum: ["image", "video"],
        default: "image"
      }
    },
    ],
    interactions: {
      likes: { type: Number, default: 0 },
      comments: [
        { user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          content: { type: String, required: true },
          createdAt: { type: Date, default: Date.now }
        }
      ],
      shares: { type: Number, default: 0 },
    },

    privacy: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "friends",
    },

    meta: {
      location: { type: String },
      device: { type: String },
      source: {
        type: String,
        enum: ["direct", "shared", "repost"],
        default: "direct",
      },
    },
  },
  {
    timestamps: true, // Thêm createdAt và updatedAt
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
