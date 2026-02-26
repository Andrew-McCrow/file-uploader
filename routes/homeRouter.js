const path = require("node:path");
const { Router } = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({ storage });

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/log-in");
}

const homeRouter = Router();

homeRouter.get("/", (req, res) => res.render("index", { user: req.user }));

homeRouter.post("/upload", ensureAuthenticated, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.render("index", { user: req.user, error: "No file selected." });
  }
  res.render("index", { user: req.user, success: `"${req.file.originalname}" uploaded successfully.` });
});

module.exports = homeRouter;
