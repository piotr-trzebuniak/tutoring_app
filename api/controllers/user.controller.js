import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Offer from "../models/offer.model.js";

export const test = (req, res) => {
  res.json({
    message: "API is working",
  });
};

// update user
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your account!"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


// delete user

export const deleteUser = async (req, res, next) => {
  if(req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete olny your account!'))
  }

  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been deleted...')
  } catch (error) {
    next(error)
  }
}

export const getUserOffers = async (req, res, next) => {

  if(req.user.id === req.params.id) {
    try {
      const offers = await Offer.find({userId: req.params.id})
      res.status(200).json(offers)
    } catch (error) {
      next(error)
    }
  }
  else {
    return next(errorHandler(401, 'You can only view your own offers!'))
  }

  

}