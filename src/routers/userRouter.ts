console.log("User router");

import express from "express";

const router = express.Router();

console.log("Auth Router");
console.log("this is atleast running");

router.get("/", (req, res) => {
  console.log(req.body);
});

export default router;
