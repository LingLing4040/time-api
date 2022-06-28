const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const codes = require("../utils/const");
const ConflictError = require("../errors/conflict-error");
const { dates } = require("joi");
require("dotenv").config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name } = req.body;

  return bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name,
        password: hash,
      })
    )
    .then((user) =>
      res.status(codes.SUCCESS_CREATED_CODE).send({
        name: user.name,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(", ")}`
          )
        );
      } else if (err.code === 11000) {
        next(new ConflictError("Такой email уже зарегистрирован"));
      } else {
        next(err);
      }
    });
};

module.exports.getMe = (req, res, next) => {
  const id = req.user._id;

  return User.findById(id)
    .orFail(new NotFoundError(`Пользователь с id ${id} не найден`))
    .then((user) => res.status(codes.SUCCESS_OK_CODE).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Невалидный id"));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfileIn = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .orFail(new NotFoundError(`Пользователь с id ${id} не найден`))
    .then((user) => {
      User.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          dates: user.dates.concat(
            ...[{ day: req.body.dates, in: req.body.dates }]
          ),
        },
        { new: true, runValidators: true }
      )
        .then((user) => res.status(codes.SUCCESS_OK_CODE).send(user))
        .catch((err) => {
          if (err.name === "ValidationError") {
            next(
              new BadRequestError(
                `${Object.values(err.errors)
                  .map((error) => error.message)
                  .join(", ")}`
              )
            );
          } else if (err.code === 11000) {
            next(new ConflictError("Такой email уже зарегистрирован"));
          } else {
            next(err);
          }
        });
    });
};

module.exports.updateProfileOut = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .orFail(new NotFoundError(`Пользователь с id ${id} не найден`))
    .then((user) => {
      const massiveLength = user.dates.length - 1;
      user.dates[massiveLength].out = req.body.out;

      User.findByIdAndUpdate(
        id,
        {
          dates: user.dates,
        },
        { new: true, runValidators: true }
      )
        .then((user) => res.status(codes.SUCCESS_OK_CODE).send(user))
        .catch((err) => {
          if (err.name === "ValidationError") {
            next(
              new BadRequestError(
                `${Object.values(err.errors)
                  .map((error) => error.message)
                  .join(", ")}`
              )
            );
          } else if (err.code === 11000) {
            next(new ConflictError("Такой email уже зарегистрирован"));
          } else {
            next(err);
          }
        });
    });
};

module.exports.login = (req, res, next) => {
  const { name, password } = req.body;

  return User.findUserByCredentials(name, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "jwtsecret"
      );
      res
        .cookie("token", token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: "none",
          secure: false,
        })
        .send({
          name: user.name,
        });
    })
    .catch((err) => {
      if (err.code === codes.UNAUTHORIZED_CODE) {
        next(new UnauthorizedError("Неправильные почта или пароль"));
      } else {
        next(err);
      }
    });
};

module.exports.logout = (req, res, next) => {
  try {
    res.clearCookie("token").send({ message: "Вы вышли из профиля" });
  } catch (err) {
    next(err);
  }
};
