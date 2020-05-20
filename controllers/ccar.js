// init code
const router = require('express').Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const car = require('./../models/mcar').cars;


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
      message: 'cars controller working...'
    });
  }
);

// create new car route
router.post(
  '/createNew',
  [
    // check not empty fields
    check('modelNumber').not().isEmpty().trim().escape(),
    check('carNumber').not().isEmpty().trim().escape(),
    check('seatingCapacity').not().isEmpty().trim().escape(),
    check('rentPerDay').not().isEmpty().trim().escape(),
    check('cityBelongsTo').not().isEmpty().trim().escape(),
    check('status').not().isEmpty().trim().escape()
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

    // create new use model
    var temp = new car({
      modelNumber: req.body.modelNumber,
      carNumber: req.body.carNumber,
      seatingCapacity: req.body.seatingCapacity,
      rentPerDay: req.body.rentPerDay,
      cityBelongsTo: req.body.cityBelongsTo,
      status: req.body.status
    });

    // insert data into database
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
);

// find car document route
//using form urlencoded data
router.get(
  '/find/',
  function findCar(req, res) {
    // find car document
    car.findOne({ carNumber : req.body.carNumber }, function (error, result) {
      // check error
      if (error) {
        return res.json({
          status: false,
          message: 'DB Find Fail...',
          error: error
        });
      }
      if (result   == null) {
        return res.json({
          message : 'car not found'
        })
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
//usong parameter passed through url
router.get(
  '/findInfo',
  function findCar(req, res) {
    // find car document
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(query.carNumber);
    car.findOne({ carNumber : query.carNumber }, function (error, result) {
      // check error
      if (error) {
        return res.json({
          status: false,
          message: 'DB Find Fail...',
          error: error
        });
      }
      if (result   == null) {
        return res.json({
          message : 'car not found'
        })
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
// update car document
router.put(
  '/update/',
  function (req, res) {
    // check email is empty or not
    if (req.body.carNumber && req.body.newCarNumber) {

          // update car document
          car.findOneAndUpdate(
            { carNumber : req.body.carNumber },
            { carNumber: req.body.newCarNumber},
            function (error, result) {
              // check error
              if (error) {
                return res.json({
                  status: false,
                  message: 'DB Update Fail...',
                  error: error
                });
              }
              if (result   == null) {
                return res.json({
                  message : 'car not found'
                })
              }
              // if everything OK
              return res.json({
                status: true,
                message: 'DB Update Success...',
                result: result
              });
            }
          );
    }else{
      return res.json({
        message : 'both fields are required '
      })
    }
  }
);

// remove car document
router.delete(
  '/delete',
  function(req, res){
    // check email not empty
    if ( req.body.carNumber ){

          // delete car document
          car.findOneAndRemove(
            //{ _id : req.body.id },
            {carNumber: req.body.carNumber},
            function(error, result){
              // check error
              if (error){
                return res.json({
                  status : false,
                  message : 'DB Delete Fail...',
                  error : error
                });
              }
              if (result   == null) {
                return res.json({
                  message : 'car not found'
                })
              }
              // everything OK
              return res.json({
                status : true,
                message : 'DB Delete Success...',
                result : result
              });
          });
  }else {
    return res.json({
      message : 'car number required to perform this operation',
    });
  }
});

// module exports
module.exports = router;
