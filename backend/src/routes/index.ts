import express from "express";
import authentication from "./auth.js";
import users from "./users.js";
import tenders from "./tenders.js";

const router = express.Router();

export default (): express.Router => {
  authentication(router)
  users(router)
  tenders(router)
  return router;
}