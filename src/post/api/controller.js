const { postLogic, updateLogic, deleteLogic } = require("../domain/domain");
const { asyncWrapper } = require("../../libraries/index");
const { StatusCodes } = require("http-status-codes");

const createPost = asyncWrapper(async (req, res) => {
  const {
    body: { userPost },
    user: userID,
    files,
  } = req;
  const post = await postLogic(userPost, userID, files);
  res.status(StatusCodes.CREATED).json({ msg: "Post created!", post: post });
});

const updatePost = asyncWrapper(async (req, res) => {
  const {
    body: { userPost },
    params: { id: postID },
    user: userID,
  } = req;
  const updatedPost = await updateLogic(userPost, postID, userID);
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Post updated successfully", updatedPost: updatedPost });
});

const deletePost = asyncWrapper(async (req, res) => {
  const {
    params: { id: postID },
    user: userID,
  } = req;
  await deleteLogic(postID, userID);
  return res.status(StatusCodes.OK).json({ msg: "Post deleted successfully" });
});

module.exports = { createPost, updatePost, deletePost };
