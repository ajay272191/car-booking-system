// init code
const mongoose = require('mongoose');
const assert = require('assert');
const db_url = process.env.DB_URL;
const db_hosted_url = process.env.DB_HOSTED_URL;
// connection code
mongoose.connect(
   db_url || db_hosted_url,
  {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : false
  },
  function(error, link){
    // check error
    assert.equal(error, null, 'DB Connect Fail...');

    // OK
    console.log('DB Connect Success...');
    //console.log(link);
  }
);


//connecting to mongoDB database
    //mongoose.connect("mongodb+srv://'ajayOnMongoDB':'0JQGLgWKkY3eBA3N'@cluster0-85ypz.mongodb.net/test?retryWrites=true&w=majority");
