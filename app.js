require("dotenv").config();

const express = require("express");
const app = express();

// import
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./src/routes/authRoutes");
const { errorHandlerMiddleware } = require("./src/libraries/index");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

// use middleware
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = () => {
  try {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
