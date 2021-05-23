const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authcontroller = require('../controllers/Authcontroller');
const bcrypt = require('bcrypt');

/* GET login form */
router.get('/', authcontroller.show);

/* POST login */
router.post('/',
  body('username').notEmpty().trim().toLowerCase(),
  body('password').notEmpty(),
  body('rememberme').toBoolean(),
  authcontroller.store
);
router.get('/kryptan/:pwd', function(req, res, next) {

  const myPlaintextPassword = req.params.pwd;

  bcrypt.hash(myPlaintextPassword, 10, function(err, hash) {
    // Store hash in your password DB.
    res.json({
      pwd: hash
    });
  });


});
module.exports = router;