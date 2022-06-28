const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UnauthorizedError = require("../errors/unauthorized-error");

const daySchema = mongoose.Schema({
  day: { type: Number },
  in: { type: Number },
  out: { type: Number },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    balance: {
      type: Number,
      default: 0,
      required: true,
    },

    dates: {
      type: [daySchema],
    },
  },
  {
    versionKey: false,
  }
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  name,
  password
) {
  return this.findOne({ name })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError("Неправильные имя или пароль")
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError("Неправильные имя или пароль")
          );
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
