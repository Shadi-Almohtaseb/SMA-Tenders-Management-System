import express from "express";
import {
  createTender,
  deleteTenderById,
  updateTenderById,
  getTendersPaginated,
  getTendersCount
} from "../db/tenders.js";

export const getAllTenders = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.max(1, Number(req.query.pageSize) || 10);

    const [tenders, total] = await Promise.all([
      getTendersPaginated(page, pageSize),
      getTendersCount()
    ]);

    return res.status(200).json({
      data: tenders,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};
export const createNewTender = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const tender = await createTender(req.body);
    return res.status(201).json(tender);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const updateTender = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const tender = await updateTenderById(id, req.body);
    return res.status(200).json(tender);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const deleteTender = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    await deleteTenderById(id);
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};
