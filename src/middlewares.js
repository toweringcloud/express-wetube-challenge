import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  console.log(`${Date.now()} | ${req.sessionID}`);
  res.locals.siteTitle = "WiAn";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  next();
};

export const protector = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

export const publicOnly = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized!");
    return res.redirect("/");
  }
};

export const fileUpload = (path, size) =>
  process.env.MODE === "OPS"
    ? multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: size * 1024 * 1024 },
      })
    : multer({
        dest: `files/${path}/`,
        limits: { fileSize: size * 1024 * 1024 },
      });
