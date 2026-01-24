import express from "express";
import {
  getAllTenders,
  createNewTender,
  updateTender,
  deleteTender
} from "../controllers/tenders.js";
import { isAuthenticated } from "../middleware/index.js";

export default (router: express.Router) => {
  router.get("/tenders", isAuthenticated, getAllTenders);
  router.post("/tenders", isAuthenticated, createNewTender);
  router.patch("/tenders/:id", isAuthenticated, updateTender);
  router.delete("/tenders/:id", isAuthenticated, deleteTender);
};
