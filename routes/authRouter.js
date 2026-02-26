const { Router } = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { prisma } = require("../db/prisma");

const authRouter = Router();

// Sign-up
authRouter.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

authRouter.post("/sign-up", async (req, res, next) => {
  try {
    const { username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.render("sign-up", { error: "Passwords do not match." });
    }
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.render("sign-up", { error: "Username already taken." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { username, password: hashedPassword },
    });
    res.redirect("/log-in");
  } catch (err) {
    next(err);
  }
});

// Log-in
authRouter.get("/log-in", (req, res) => {
  res.render("log-in");
});

authRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);

// Log-out
authRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = authRouter;
