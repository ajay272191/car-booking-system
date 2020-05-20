// init code
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const local_port = process.env.LOCAL_PORT;
const hosted_port = process.env.PORT;
const database = require('./models/dbconnection');
const customerController = require('./controllers/ccustomer');
const carController = require('./controllers/ccar');
const bookingController = require('./controllers/cbooking');

// template engine setup
app.set('view engine', 'ejs');
//static files
app.use(express.static(__dirname + '/public'));

// middleware setup
app.use(morgan('dev'));
app.use(cors());
app.use('/api/customer', customerController);
app.use('/api/car', carController);
app.use('/api/booking',bookingController);
// defaults routes
app.all(
  '/',
  function(req, res){
    return res.render('index')
  }
);

// start server
app.listen(
  hosted_port || local_port,
  function(){
    console.log('Server running at port : ' + local_port + ' or ' + hosted_port );
  }
);
