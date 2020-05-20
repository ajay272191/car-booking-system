// init code
const https = require('http');
const router = require('express').Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const book = require('./../models/mbooking');
// const car = require('./../models/mcar').cars;
// const customer = require('./../models/mcustomer').customers;

// middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// routes goes here

// default route
router.all(
  '/',
  function (req, res) {
    return res.json({
      status: true,
      message: 'booking controller working...'
    });
  }
);



// create new book route
router.post(
  '/createNew',
  [
    //  date validation yyyy/mm/dd
    check('issueDate').isISO8601().toDate(),
    check('returnDate').isISO8601().toDate(),

    //car details validation
    //check('modelNumber').not().isEmpty().trim().escape(),
    check('carNumber').not().isEmpty().trim().escape(),
    //check('seatingCapacity').not().isEmpty().trim().escape(),
    //check('rentPerDay').not().isEmpty().trim().escape(),
    //check('cityBelongsTo').not().isEmpty().trim().escape(),
    //check('status').not().isEmpty().trim().escape(),

    //customer details validation
    //check('name').not().isEmpty().trim().escape(),
    //check('phoneNumber').not().isEmpty().trim().escape(),
    check('origin').not().isEmpty().trim().escape(),
    check('destination').not().isEmpty().trim().escape()
    //check('bookname').not().isEmpty().trim().escape(),
    //check('password').not().isEmpty().trim().escape(),
    //check('email').isEmail().normalizeEmail()
    ],
  function (req, res) {
    // check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: 'Form validation error.',
        errors: errors.array()
      });
    }
    //check if car already booked

    var carNumber =req.body.carNumber;
    var carStatus = false;
    // https.get('http://127.0.0.1:3000/api/booking/findInfo?carInfo=carInfo', (resp) => {
    //   let data = '';
    //   // A chunk of data has been recieved.
    //   resp.on('data', (chunk) => {
    //     data += chunk;
    //     //console.log(JSON.parse(data));
    //     //carStatus = JSON.parse(data).status;
    //
    //   });
    //   // // The whole response has been received. Print out the result.
    //   // resp.on('end', () => {
    //   //   console.log(JSON.parse(data).explanation);
    //   // });
    //
    // }).on("error", (err) => {
    //     console.log("Error: " + err.message);
    //   });

    if (carStatus) {
      return res.json({
        bookingStatus: false,
        message: 'car already booked...',
      });
    }else {
      // create new use model
      var temp = new book({
        issueDate : req.body.issueDate,
        returnDate : req.body.returnDate,
        carNumber : req.body.carNumber,
        //name : req.body.name,
        //phoneNumber : req.body.phoneNumber,
        origin : req.body.origin,
        destination : req.body.destination
      });
      // var carDetails =new car({
      //   modelNumber: req.body.modelNumber,
      //   carNumber: req.body.carNumber,
      //   seatingCapacity: req.body.seatingCapacity,
      //   rentPerDay: req.body.rentPerDay,
      //   cityBelongsTo: req.body.cityBelongsTo,
      //   status: true
      // })
      // var customerDetails = new customer({
      //   name: req.body.name,
      //   phoneNumber: req.body.phoneNumber
      //   // bookname: req.body.bookname,
      //   // email: req.body.email,
      //   // password: hashedPassword
      // })
      // temp.carSchema.push(carDetails)
      // //temp.save(callback)
      // temp.customerSchema.push(customerDetails)
      // //  temp.save(callback)
      // // insert data into database
      temp.save(function (error, result) {
        // check error
        if (error) {
          return res.json({
            status: false,
            message: 'DB Insert Fail...',
            error: error
          });
        }
        // Everything OK
        return res.json({
          status: true,
          message: 'DB Insert Success...',
          result: result
        });
      });
    }
  }
);

// find book document route
router.get(
  '/find/',
  function (req, res) {
    // find book document
    book.findOne({phoneNumber : req.params.phoneNumber }, function (error, result) {
      // check error
      if (error) {
        return res.json({
          status: false,
          message: 'DB Find Fail...',
          error: error
        });
      }

      // if everything OK
      return res.json({
        status: true,
        message: 'DB Find Success...',
        result: result
      });
    });
  }
);

// module exports
module.exports = router;
