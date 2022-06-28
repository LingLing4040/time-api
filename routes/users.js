const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error("URL validation err");
};

const {
  getMe,
  updateProfileIn,
  updateProfileOut,
} = require("../controllers/users");

router.get("/users/me", getMe);
router.patch(
  "/users/me/in",
  // celebrate({
  //   body: Joi.object().keys({
  //     name: Joi.string().min(2).max(30).required(),
  //     balance: Joi.number().required(),
  //   }),
  // }),
  updateProfileIn
);
router.patch(
  "/users/me/out",
  // celebrate({
  //   body: Joi.object().keys({
  //     name: Joi.string().min(2).max(30).required(),
  //     balance: Joi.number().required(),
  //   }),
  // }),
  updateProfileOut
);

module.exports = router;
