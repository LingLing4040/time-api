// const BadRequestError = require("../errors/bad-request-error");
// const NotFoundError = require("../errors/not-found-error");

// module.exports.getMe = (req, res, next) => {
//   const id = req.user._id;
//  let payload ;

//   User.findById(id)
//     .orFail(new NotFoundError(`Пользователь с id ${id} не найден`))
//     .then((user) => res.status(codes.SUCCESS_OK_CODE).send(user))
//     .catch((err) => {
//       if (err.name === "CastError") {
//         next(new BadRequestError("Невалидный id"));
//       } else {
//         next(err);
//       }
//     });

//     req.user.date =

//   next();
// };
