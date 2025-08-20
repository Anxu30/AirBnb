const mongoose=require('mongoose');
const Host = require("./host");
const HomeSchema=mongoose.Schema({
  HomeName:{
    type:String,
    required:true
  },
  Location:{
    type:String,
    required:true
  },
  Price:{
    type:Number,
    required:true
  },
  Rating:{
    type:Number,
    required:true
  },
   Description:{
    type:String,
    required:true
  },
PhotoURL:{
  type:String,
  required:true
},
Email:{
  type:String,
  required:true,

}


})
const homeAddkro=async function addHome(doc){
const Id=doc._id;
let count=0;
const data=await Host.findOne({host_Email:doc.Email });

for(let i=0;i<data.host_Id.length;i++){
  if(data.host_Id[i]==Id){
count++;
}

}
if(!count){
 await Host.findOneAndUpdate({host_Email:doc.Email},{
    $push:{
      host_Id:Id
    }
  },{
  new: true 
  })
}
return;
}


const homeDeletekro=async function deleteHome(){
const Id=this.getFilter()._id;
const mail=this.getFilter().Email;
await Host.findOneAndUpdate({host_Email:mail},{
  $pull:{
host_Id:Id
  }
});
return;
}

HomeSchema.post('save',homeAddkro);
HomeSchema.pre('findOneAndDelete',homeDeletekro);

module.exports=mongoose.model('Home',HomeSchema);

 