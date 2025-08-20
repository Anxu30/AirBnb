const mongoose=require('mongoose');
const userGuestSchema=new mongoose.Schema({
  guest_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
    unique:true
  },
  user_Email:{
type:String,
required:true,
unique:true
  },
  fav_Home:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Home',
    default: []

  }],
  book_Home:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Home',
    default: null

  }
})
module.exports=mongoose.model('Guest',userGuestSchema);