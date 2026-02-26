require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const passport = require("./config/passport");
const { prisma } = require("./db/prisma");
const homeRouter = require("./routes/homeRouter");
const authRouter = require("./routes/authRouter");

const app = express();

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// body parsing
app.use(express.urlencoded({ extended: false }));

// session with Prisma store
app.use(
  session({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // prune expired sessions every 2 min
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

// passport
app.use(passport.session());

// make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// routes
app.use("/", homeRouter);
app.use("/", authRouter);

// start the server
app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
