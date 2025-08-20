const mongoose=require('mongoose');
const hostSchema=mongoose.Schema({
  host_id:{
type:String,
required:true,
unique:true
  },
  host_Email:{
    type:String,
    required:true,
    unique:true
  },
  host_Id:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'home',
    default:[]

  }]

});
module.exports=mongoose.model('Host',hostSchema);