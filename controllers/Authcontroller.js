const bcrypt = require('bcrypt');
const { query } = require('../models/db');
const { body, validationResult } = require('express-validator');

module.exports.show = async function(req, res, next) {
    if (req.session.loggedin) {
        return res.redirect('/home');
    }
    return res.render('login');
};

module.exports.destroy = async function(req, res, next) {
  // logga ut användaren
  req.session.loggedin = false;
  req.session.destroy();
  return res.redirect('/');
};

module.exports.store = async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(401).render('login',{ username: req.body.username, errors: errors.array()});    }
    const username = req.body.username;
    const password = req.body.password;

    try {
      const sql = 'SELECT id, password FROM users WHERE name = ?';
      const user = await query(sql, username);

      if(user.length > 0) {
        bcrypt.compare(password, user[0].password, function(err, result) {
          if (result == true) {
            req.session.loggedin = true;
            req.session.username = username;
            req.session.id = user[0].id;
            req.session.username = username;

            if ( req.body.rememberme ) {
              const hour = 3600000;
              req.session.cookie.maxAge = 14 * 24 * hour; //2 weeks
            }
            
            res.redirect('/home');
          } else {
            return res.status(401)
              .render('login',{ username: req.body.username, errors: 'Wrong username or password!'});          }
        });
      } else {
        return res.status(401)
          .render('login',{ username: req.body.username, errors: 'Wrong username or password!'});      }
    } catch (e) {
      next(e);
      console.error(e);
    }
};