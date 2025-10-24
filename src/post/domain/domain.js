const requestDb = require("../../libraries/query/query");
const error = require("../../libraries/errors");
const { uploadFiles } = require("../../libraries/index");

const postLogic = async (userPost, userID, files) => {
  const results = await uploadFiles(files);
  const text =
    "insert into post (user_post, user_id, post_img) values ($1, $2, $3)";
  const post = await requestDb(text, [userPost, userID, results]);
  return post;
};

const updateLogic = async (userPost, postID, userID) => {
  const text = "update post set user_post = $1 where id = $2 and user_id = $3";
  const updatedPost = await requestDb(text, [userPost, postID, userID]);
  return updatedPost;
};

const deleteLogic = async (postID, userID) => {
  const text = "delete from post where id = $1 and user_id = $2";
  await requestDb(text, [postID, userID]);
};

module.exports = { postLogic, updateLogic, deleteLogic };
