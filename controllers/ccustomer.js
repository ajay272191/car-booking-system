// init code
const router = require('express').Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const customer = require('./../models/mcustomer').customers;


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
      message: 'customer controller working...'
    });
  }
);

// create new customer route
router.post(
  '/createNew',
  [
    // check not empty fields
    check('name').not().isEmpty().trim().escape(),
    check('phoneNumber').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()

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

    // hash password code
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // create new use model
    var temp = new customer({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: hashedPassword
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

// find customer document route
router.get(
  '/find',
  function (req, res) {
    if(req.body.phoneNumber){
      // find customer document
      customer.findOne({phoneNumber: req.body.phoneNumber}, function (error, result) {
        // check error
        if (error) {
          return res.json({
            status: false,
            message: 'DB Find Fail...',
            error: error
          });
        }
        if(result == null){
          return res.json({
            message : 'customer with provided phone number does\'nt exist '
          })
        }
        // if everything OK
        return res.json({
          status: true,
          message: 'DB Find Success...',
          result: result
        });
      });
    }else {
      return res.json({
        status: false,
        message: 'phone number not privided'
      })
    }
  }
);

// update customer document
router.put(
  '/update/',
  function (req, res) {
    // check email is empty or not (req.params.id) use it when data send as parameter
    if (req.body.phoneNumber && req.body.newPhoneNumber) {
      // update customer document
      customer.findOneAndUpdate(
        {phoneNumber : req.body.phoneNumber},
        { phoneNumber: req.body.newPhoneNumber },
        function (error, result) {
          // check error
          if (error) {
            return res.json({
              status: false,
              message: 'DB Update Fail...',
              error: error
            });
          }
          if(result == null){
            return res.json({
              message : 'cant update : customer with provided phone number does\'nt exist '
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
    } else {
      return res.json({
        status : false,
        message : 'phoneNumbers not provided...'
      });
    }
  }
);

// remove customer document
router.delete(
  '/delete',
  function(req, res){
    // check email not empty
    if ( req.body.phoneNumber){
      customer.findOneAndRemove(
        //{ _id : req.params.id },
        {phoneNumber:req.body.phoneNumber},
        function(error, result){
          // check error
          if (error){
            return res.json({
              status : false,
              message : 'DB Delete Fail...',
              error : error
            });
          }
          //not found
          if(result == null){
            return res.json({
              message : 'details with this phone not exist : can\'t be deleted  '
            })
          }
          // everything OK
          return res.json({
            status : true,
            message : 'DB Delete Success...',
            result : result
          });
        }
      );
    } else {
      // if email not provided
      return res.json({
        status : false,
        message : 'phoneNumber not provided.'
      });
    }
  }
);

// login router for customer
router.post(
  '/login',
  [
    // check not empty fields
    check('password').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()
  ],
  function(req, res){
    // check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: 'Form validation error.',
        errors: errors.array()
      });
    }

    // check email exist or not
    customer.findOne(
      { email : req.body.email },
      function(error, result){
        // check error
        if (error){
          return res.json({
            status : false,
            message : 'DB Read Fail...',
            error : error
          });
        }

        // result is empty or not
        if ( result ){
          // when result variable contains document
          // match password
          const isMatch = bcrypt.compareSync(req.body.password, result.password);
          console.log(isMatch);
          // check password is match
          if (isMatch){
            // password matched
            return res.json({
              status : true,
              message : 'customer exists. Login Success...',
              result : result
            });
          } else {
            // password not matched
            return res.json({
              status : false,
              message : 'Password not matched. Login Fail...',
            });
          }
        } else {
          // customer document don't exists
          return res.json({
            status : false,
            message : 'customer don\'t exists.'
          });
        }

      }
    );
  }
);

// module exports
module.exports = router;
