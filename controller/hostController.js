const Home = require("../model/home");
const Host=require('../model/host');


exports.getHome = (req, res, next) => {
  const editing = false;

  res.render("../views/host/editHome", { editing ,isLoggedIn:req.isLoggedIn,currentPage:'Add Home',user:req.session.user});
};


exports.postHome = (req, res, next) => {
  const { homeurl, homes, locations, prices, rating, description } = req.body;
  const Email=req.session.mail;
  const home = new Home({
    HomeName:homes,
    Location:locations,
    Price:prices,
    Rating:rating,
    Description:description,
    PhotoURL:homeurl,
    Email:Email
  });

  home
    .save()
    .then(() => {

      const editing = false;
      res.render("../views/host/postAddHome", { editing,isLoggedIn:req.isLoggedIn,currentPage:'Add Home' ,user:req.session.user});
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.hostHomes = async (req, res, next) => {
 const array=[];
 Host.findOne({host_Email:req.session.mail}).then(async (data)=>{
  for(let i=0;i<data.host_Id.length;i++){
    const meta=await Home.findOne({_id:data.host_Id[i]})
    array.push(meta);

  }
      res.render("../views/host/host-home-list", { homes:array ,isLoggedIn:req.isLoggedIn,currentPage:'HostHomes',user:req.session.user});
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.hostEditHome = (req, res, next) => {
  const Id = req.params.editId;
  const editing = req.query.editing === "true";
   const { homes, locations, prices, rating, homeurl, description } = req.body;
 Home.findByIdAndUpdate(Id,{
  HomeName:homes,
  Location:locations, 
  Price:prices, 
  Rating:rating, 
  PhotoURL:homeurl, 
  Description:description 
}).then(()=>{
  res.render('../views/host/postAddHome.ejs',{editing,isLoggedIn:req.isLoggedIn,currentPage:'HostHomes',user:req.session.user});
 }).catch(()=>{
  console.log('error');
  res.redirect('/host/editHome');
 });
}
 


exports.hosteditHome = (req, res, next) => {
  const Id = req.params.editId;
  const editing = req.query.editing === "true";
  Home.findById(Id)
    .then((row) => {
      res.render("../views/host/editHome", { home:row, Id, editing,isLoggedIn:req.isLoggedIn,currentPage:'HostHomes',user:req.session.user });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.hostdelHome = (req, res, next) => {
  const Id = req.params.editId;
  const editing = req.query.editing === "true";
  Home.findOneAndDelete({_id:Id,Email:req.session.mail}).then(async ()=>{
    return data=await Home.find({Email:req.session.mail})
  }).then((data)=>{
     res.render("../views/host/host-home-list", { homes: data,isLoggedIn:req.isLoggedIn ,currentPage:'HostHomes',user:req.session.user});
  }).catch((err)=>{
    console.log(err);
  });
   
};
