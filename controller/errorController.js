const { Home } = require('../model/home');

exports.errorHome = (req, res, next) => {
  res.status(404).render('error',{isLoggedIn:req.isLoggedIn,currentPage:"",user:false});
};