const express = require("express");
const postRouter = express.Router();
const { createPost, updatePost, deletePost } = require("../post/index");
const uploadMiddleware = require("../libraries/middleware/multer");

postRouter
  .post("/createpost", uploadMiddleware, createPost)
  .patch("/updatepost/:id", updatePost)
  .delete("/deletepost", deletePost);

module.exports = postRouter;
