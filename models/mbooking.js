// init code
const mongoose = require('mongoose');
// const {cars, carSchema} = require('./mcar');
// const {customers, customerSchema} = require('./mcustomer');

// user schema
const bookingSchema = mongoose.Schema({
  issueDate: {
    type : Date,
    required : true,
    default : Date.now
  },
  returnDate: {
    type : Date,
    required : true,
    default  : Date.now
  },
  carNumber:{
    type : String,
    required : true,
    unique : true
  },
  origin:{
    type : String,
    required : true
  },
  destination :{
    type : String,
    required : true
  },

  // carSchema : [{ type : mongoose.Schema.ObjectId, ref : 'carSchema' }], //[carSchema],
  // customerSchema : [{ type : mongoose.Schema.ObjectId, ref : 'customerSchema' }]// [customerSchema]
});


// user model
mongoose.model('bookings',bookingSchema);


// module exports
module.exports = mongoose.model('bookings');
