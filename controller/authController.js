const User = require("../model/user");
const Guest = require("../model/guest");
const Host = require("../model/host");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

exports.authGetLogin = (req, res, next) => {
  isLoggedIn = false;
  res.render("../views/auth/login", { isLoggedIn, currentPage: "login",user:false});
};

exports.authPostLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const data = await User.findOne({ email: email });
  if (data) {
    const meta = await bcrypt.compare(password,data.password);

    if (meta) {
      req.session.isLoggedIn = true;
      req.session.user=data.userType;
      req.session.mail=data.email;
      req.session.name=data.fname+' '+data.lname;
      return res.redirect('/');
    } 
    else {
      req.session.isLoggedIn = false;
      return res.redirect("/login");
    }
  } 
  else {
    console.log('You need to Signup First');
    req.session.isLoggedIn = false;
   return  res.redirect("/login");
  }
};

exports.authLogOut = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
exports.authGetSignUp = (req, res, next) => {
  isLoggedIn = false;
  res.render("../views/auth/signup", {
    isLoggedIn,
    currentPage: "Sign Up",
    arr: [],
    obj: { fname: "", lname: "", email: "", password: "", cpassword: "" },
  user:false});
};

exports.authPostSignUp = [
  check("fname")
    .notEmpty()
    .withMessage("First Name must be Filled")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name must be min:2")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Only Alpha Allowed"),

  check("lname")
    .notEmpty()
    .withMessage("Last Name must be Filled")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last Name must be min:2")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Only Alpha Allowed"),

check("email").isEmail().withMessage("Enter a Valid Email").normalizeEmail({gmail_remove_dots: false}),

  check("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password length must be min: 8")
    .matches(/[a-z]/)
    .withMessage("Password must contain small letters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain Capital letters")
    .matches(/[0-9]/)
    .withMessage("Password must contain digits")
    .matches(/[#,$,@]/)
    .withMessage("Password must contain special characters"),

  check("cpassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm Password must be matched");
      }
      return true;
    }),
  check("userType")
    .notEmpty()
    .withMessage("User type must be Checked")
    .isIn(["guest", "host"])
    .withMessage("Invalid User Type"),

  async (req, res, next) => {
    const error = validationResult(req);
    const { fname, lname, email, password, cpassword,userType } = req.body;

    if (!error.isEmpty()) {
      const arr = error.array().map((h) => {
        return h.msg;
      });
      return res.render("../views/auth/signup.ejs", {
        isLoggedIn: false,
        obj: { fname, lname, email, password, cpassword },
        arr: arr,
        currentPage: "Sign Up",
      });
    } 
    else {
      const userData=await User.findOne({email:email});
      if(!userData){
      bcrypt
        .hash(password, 12)
        .then(async (hashedPassword) => {
          const user = new User({
            fname,
            lname,
            email,
            password: hashedPassword,
            userType
          });
          const savedUser = await  user.save();

   if(savedUser.userType==='guest'){
    const guest=new Guest({
guest_id:savedUser._id,
user_Email:savedUser.email,
    });
   await guest.save();
   }

   if(savedUser.userType==='host')
   {
const host=new Host({
host_id:savedUser._id,
host_Email:savedUser.email,
});
await host.save();
}
       return  res.redirect("/login");
        })
        .catch((err) => {
          if (err) {
            console.log(err);
            res.render("../views/auth/signup", {
              isLoggedIn: false,
              obj: {
                fname: "",
                lname: "",
                email: "",
                password: "",
                cpassword: "",
              },
              arr: [],
              currentPage: "Sign Up",
              user:false
            });
          }
        });
    }
    else{
      console.log('User is Already registered With This Email');
      return res.redirect('/signup');
    }
  }
  },
];
 

exports.termsConditions=(req,res,next)=>{
  res.render('../views/auth/Terms&Conditions',{isLoggedIn:req.isLoggedIn,currentPage:"",user:req.session.user});
}
