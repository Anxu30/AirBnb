const express = require("express");
const mongoose = require("mongoose");
const session=require('express-session');
const mongoDB=require('connect-mongodb-session')(session);

const app = express();
const port = 1210;
const db_Path ="mongodb+srv://root:*******%40***@anujchaudhary.ymavmtv.mongodb.net/AirBnb?retryWrites=true&w=majority&appName=AnujChaudhary";

const auth = require("./routes/auth");
const host = require("./routes/host");
const user = require("./routes/user");
const error = require("./routes/error");
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded());
const store=new mongoDB({
uri: db_Path,
collection:'sessions'
})
app.use(session({
  secret:'300301',
  resave:false,
  saveUninitialized:false,
  store:store
}));


app.use((req, res, next) => {
  console.log(req.session);
  req.isLoggedIn = req.session.isLoggedIn == true;
  next();
});

app.use(auth);
app.use(["/hosthomes", "/bookings", "/favorites"], (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use(user);
app.use(host);
app.use(error);

mongoose
  .connect(db_Path)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server Running At Address http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

