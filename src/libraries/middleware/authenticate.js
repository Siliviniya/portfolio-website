const error = require("../../libraries/errors");
const { verifyJWT } = require("../../libraries/index");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new error.BadRequest("Double check your headers again");
  }
  const token = authHeader.split(" ")[1];
  const payload = verifyJWT(token);
  console.log(payload);
  req.user = payload.id;
  next();
};

module.exports = authenticate;
