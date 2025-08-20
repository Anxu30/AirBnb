const mongoose=require('mongoose');
const bookSchema=mongoose.Schema({
  bookId:String
})

module.exports=mongoose.model('Booking',bookSchema);