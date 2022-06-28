const router = require("express").Router();
const NotFoundError = require("../errors/not-found-error");
const auth = require("../middlewares/auth");
const dates = require("../middlewares/dates");

const authRouter = require("./auth-router");
const usersRouter = require("./users");

router.use("/", authRouter);
router.use(auth);
// router.use(dates);
router.use("/", usersRouter);
router.use((req, res, next) => {
  next(new NotFoundError("Маршрут не найден"));
});

module.exports = router;
