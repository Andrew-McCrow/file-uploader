const { Router } = require("express");

const homeRouter = Router();

homeRouter.get("/", (req, res) => res.render("index", { user: req.user }));

module.exports = homeRouter;
