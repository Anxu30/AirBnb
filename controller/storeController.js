const Home = require("../model/home");
const Guest = require("../model/guest");
const User = require("../model/user");
const { ObjectId } = require("mongodb");

exports.userHome = (req, res, next) => {
  const user = req.session.user;
  const name = req.session.name;
  res.render("../views/store/home", {
    isLoggedIn: req.isLoggedIn,
    currentPage: "AirBnb",
    user,
    name,
  });
};

exports.homeList = (req, res, next) => {
  Home.find()
    .then((homes) => {
      res.render("../views/store/home-list", {
        homes,
        isLoggedIn: req.isLoggedIn,
        currentPage: "Homes",
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.homeDetails = (req, res, next) => {
  const Id = req.params.homeId;
  Home.findById(Id)
    .then((data) => {
      res.render("../views/store/home-detail", {
        home: data,
        isLoggedIn: req.isLoggedIn,
        currentPage: "Homes",
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.favSet = async (req, res, next) => {
  let count = 0;
  const Id = req.params.favId;
  await Guest.findOne({ user_Email: req.session.mail })
    .then((data) => {
      if (data.fav_Home) {
        for (i = 0; i < data.fav_Home.length; i++) {
          if (data.fav_Home[i] == Id) {
            count++;
          }
        }
      }

      return count;
    })
    .then(async (c) => {
      if (!c) {
        await Guest.findOneAndUpdate(
          { user_Email: req.session.mail },
          {
            $push: {
              fav_Home: Id,
            },
          },
          {
            new: true,
          }
        );
        console.log("Added To Fav Homes");
        res.redirect("/homes");
      } else {
        console.log("Repetition In Fav Homes");
        res.redirect("/homes");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.favorites = (req, res, next) => {
  Guest.findOne({ user_Email: req.session.mail })
    .then(async (data) => {
      let array = [];
      let id = null;
      if (data.fav_Home.length) {
        for (let i = 0; i < data.fav_Home.length; i++) {
          id = data.fav_Home[i];
          const fav_Data = await Home.findOne({ _id: id });
          if (fav_Data) {
            array.push(fav_Data);
          }
        }
        console.log("Favorites:", array);
        return res.render("../views/store/favorite-list.ejs", {
          data: array,
          isLoggedIn: req.isLoggedIn,
          currentPage: "Favorites",
          user: req.session.user,
        });
      }
      return res.render("../views/store/favorite-list.ejs", {
        data: array,
        isLoggedIn: req.isLoggedIn,
        currentPage: "Favorites",
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.delfav = async (req, res, next) => {
  let array = [];
  const Id = req.params.favId;
  let id = null;
  Guest.findOne({ user_Email: req.session.mail })
    .then(async (data) => {
      for (let i=0; i < data.fav_Home.length; i++) {
        if (Id == data.fav_Home[i]) {
          await Guest.findOneAndUpdate(
            { user_Email: req.session.mail },
            {
              $pull: { fav_Home:Id },
            }
          );
        }
      }


      return Guest.findOne({ user_Email: req.session.mail })
    }).then(async (data) => {
      
       
        if (data.fav_Home.length) {
          for (let i = 0; i < data.fav_Home.length; i++) {
            id = data.fav_Home[i];
            const fav_Data = await Home.findOne({ _id: id });
            if (fav_Data) {
              array.push(fav_Data);
            }
          }
          console.log("Favorites:", array);
          return res.render("../views/store/favorite-list.ejs", {
            data: array,
            isLoggedIn: req.isLoggedIn,
            currentPage: "Favorites",
            user: req.session.user,
          });
    }
    
    return res.render("../views/store/favorite-list.ejs", {
      data: array,
      isLoggedIn: req.isLoggedIn,
      currentPage: "Favorites",
      user: req.session.user,
    });

  })
  
    .catch((err) => {
      console.log(err);
    });
};











exports.bookings = (req, res, next) => {
  Guest.findOne({ user_Email: req.session.mail })
    .then((data) => {
      return Home.findOne({ _id: data.book_Home });
    })
    .then((data) => {
      res.render("../views/store/bookings", {
        homes: data,
        isLoggedIn: req.isLoggedIn,
        currentPage: "Bookings",
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.booking = (req, res, next) => {
  const Id = req.params.bookId;
  let count = 0;
  const mail = req.session.mail;
  console.log("Session mail:", mail);
  Guest.findOne({ user_Email: mail })
    .then((data) => {
      console.log("Guest data:", data);
      if (!data) {
        console.log("No matching guest found in DB for", mail);
      }
      if (data.book_Home === Id) {
        count++;
      }

      return count;
    })
    .then((count) => {
      if (!count) {
        Guest.findOneAndUpdate({ user_Email: mail }, { book_Home: Id }).then(
          () => {
            console.log(" Booking is Done For You");
            return res.redirect("/homes");
          }
        );
      } else {
        console.log(" Repetitive Bookings Can not Be Done For the Same Home");
        return res.redirect("/homes");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.delbook = (req, res, next) => {
  const Id = req.params.bookId;
  let id = 0;
  Guest.findOne({ user_Email: req.session.mail })
    .then(() => {
      return Guest.findOneAndUpdate(
        { book_Home: Id },
        { $set: { book_Home: null } }
      );
    })
    .then(() => {
      res.redirect("/homes");
    })
    .catch((err) => {
      console.log(err);
    });
};
