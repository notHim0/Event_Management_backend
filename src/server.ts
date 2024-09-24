import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";

//import route handlers
import eventRouter from "./routers/eventRouter";
import userRoutes from "./routers/userRouter";
import authRoutes from "./routers/authRouter";
import clubRouter from "./routers/clubRouter";

import { configDotenv } from "dotenv";
configDotenv();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use(express.urlencoded({ extended: true }));

//routers
app.use(eventRouter);
app.use("/api/user", userRoutes);
// app.use("/api", authRoutes);
app.use(clubRouter);

app.listen(port, () => console.log("Server is up and running..."));
