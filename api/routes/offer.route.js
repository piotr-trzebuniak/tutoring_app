import express from "express";
import { addOffer, deleteOffer, updateOffer, getOffer, getOffers } from "../controllers/offer.controller.js";
import {verifyToken} from '../utils/verifyUser.js'


const router = express.Router();

router.post("/add-offer", verifyToken, addOffer);
router.delete("/delete/:id", verifyToken, deleteOffer);
router.post("/update/:id", verifyToken, updateOffer);
router.get("/get/:id", getOffer);
router.get("/getoffers", getOffers);

export default router;