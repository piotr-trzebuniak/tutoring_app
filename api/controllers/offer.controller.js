import Offer from "../models/offer.model.js";
import { errorHandler } from "../utils/error.js";

export const addOffer = async (req, res, next) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json(offer);
  } catch (error) {
    next(error);
  }
};

export const deleteOffer = async (req, res, next) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    return next(errorHandler(404, "Offer not found!"));
  }
  if (req.user.id !== offer.userId) {
    return next(errorHandler(401, "You can delete only your own offers!"));
  }

  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateOffer = async (req, res, next) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    return next(errorHandler(404, "Offer not found!"));
  }
  if (req.user.id !== offer.userId) {
    return next(errorHandler(401, "You can update only your own offers!"));
  }

  try {
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedOffer);
  } catch (error) {
    next(error);
  }
};

export const getOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return next(errorHandler(404, "Offer not found!"));
    }
    res.status(200).json(offer);
  } catch (error) {
    next(error);
  }
};

export const getOffers = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const regexSearchLocation = new RegExp(req.query.searchLocation, 'i')
    const regexSearchSubject = new RegExp(req.query.searchSubject, 'i')



    const offers = await Offer.find({
      ...(req.query.searchLocation && { location: regexSearchLocation}),
      ...(req.query.searchSubject && { subject: regexSearchSubject }),
      ...(req.query.gender && { gender: req.query.gender }),
      ...(req.query.level && { level: req.query.level }),
      ...(req.query.typeClasses && { typeClasses: req.query.typeClasses }),
      ...(req.query.priceRange && { priceRange: req.query.priceRange }),
    })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(offers);
  } catch (error) {
    next(error);
  }
};
