// init code
const mongoose = require('mongoose');

// user schema
const customerSchema = mongoose.Schema({
  name : {
    type : String,
    required : true
  },
   phoneNumber: {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  isActive : {
    type : Boolean,
    default : true
  },
  createdOn : {
    type : Date,
    default : Date.now()
  }
});


// user model
mongoose.model('customers',customerSchema);


// module exports
module.exports = {
  customers : mongoose.model('customers'),
  customerSchema: customerSchema
}
//module.exports = mongoose.model('customers');
