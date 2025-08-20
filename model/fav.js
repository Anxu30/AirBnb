const mongoose=require('mongoose');
const favSchema=mongoose.Schema({
  favId:String
})

module.exports=mongoose.model('favorites',favSchema);
