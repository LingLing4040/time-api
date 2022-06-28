const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { createUser, login, logout } = require("../controllers/users");

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser
);

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
router.post("/signout", logout);

module.exports = router;
