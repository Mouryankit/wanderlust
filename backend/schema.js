
const Joi = require('joi');

const listingSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().required(),
  location: Joi.string().trim().required(),
  country: Joi.string().trim().required(),

  price: Joi.number().min(0).required(),

  contactNo: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Enter a valid 10-digit Indian phone number"
    }),

  totalRooms: Joi.number().min(1).required(),

  category: Joi.string().trim().required(),
});

const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().required()
});

const bookingSchema = Joi.object({
  checkIn: Joi.date().iso().required(),
  checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
  guests: Joi.number().integer().min(1).required(),
  rooms: Joi.number().integer().min(1).required()
});

module.exports = { listingSchema, reviewSchema, bookingSchema };