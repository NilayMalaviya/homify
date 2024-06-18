const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const listingRouter = require("./routes/listing");
const bookingRouter = require("./routes/booking");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "Homify",
  })
  .then(() => {
    console.log("connected to DB");
  })
  .catch((e) => {
    console.log(e);
    console.log("Not Connected");
  });

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/server/user", userRouter);
app.use("/server/auth", authRouter);
app.use("/server/listing", listingRouter);
app.use("/server/booking", bookingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (re, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(3000, () => {
  console.log("server running on 3000!!!");
});
