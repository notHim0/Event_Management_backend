import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";

import eventRouter from "./routers/eventRouter";
const app = express();
const port = 5000;

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

app.listen(port, () => console.log("Server is up and running..."));
