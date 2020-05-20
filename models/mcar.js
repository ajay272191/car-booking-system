// init code
const mongoose = require('mongoose');

// user schema
const carSchema = mongoose.Schema({
  modelNumber : {
    type : String,
    required : true
  },
  carNumber: {
    type : String,
    required : true,
    unique : true
  },
  seatingCapacity: {
   type : String,
   required : true
 },
 rentPerDay: {
  type : String,
  required : true
  },
  cityBelongsTo: {
    type : String,
    required : true
  },
  status: {
    type : String,
    //required : true
    default : false
  },
  joinedOn : {
    type : Date,
    default : Date.now()
  }
});


// user model
mongoose.model('cars',carSchema);

//module exports
module.exports = {
  cars : mongoose.model('cars', carSchema),
  carSchema : carSchema
}
