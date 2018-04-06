const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = require('../../models/user');

router.post('/users', (req, res, next) => {
  // check if the email is unique
  User.findOne({email: req.body.email})
    .exec()
    .then(user => {
      if (user) {
        return res.status(422).json({
          title: 'User can not be created',
          error: {
            message: 'The email address has been taken'
          }
        });
      }

      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.email === 'spencer.feng@icloud.com'
      });
      newUser.save()
        .then(user => {
          const transformedUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin
          };
          const token = jwt.sign(
            {
              user: transformedUser
            },
            process.env.JWT_SECRET,
            {
              expiresIn: 7200
            }
          );
          res.status(201).json({
            message: 'User created',
            token: token,
            userId: transformedUser._id,
            user: transformedUser
          });
        })
        .catch(error => {
          res.status(500).json({
            title: 'An error occurred',
            error: error
          });
        })
    })
    .catch(error => {
      res.status(500).json({
        title: 'An error occurred',
        error: error
      });
    });
});

router.post('/signin', (req, res, next) => {
  User.findOne({email: req.body.email})
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          title: 'Login failed',
          error: {
            message: 'Invalid login credentials'
          }
        });
      }

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
          title: 'Login failed',
          error: {
            message: 'Invalid login credentials'
          }
        })
      }

      const transformedUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        lastViewedChannel: user.lastViewedChannel,
        isAdmin: user.isAdmin
      };

      const token = jwt.sign({user: transformedUser}, process.env.JWT_SECRET, {expiresIn: 7200});
      res.status(200).json({
        message: 'Successfully logged in',
        token: token,
        userId: user._id,
        user: transformedUser
      });
    })
    .catch(error => {
      res.status(500).json({
        title: 'An error occurred',
        error: error
      });
    });
});

router.post('/checkEmailNotTaken', (req, res, next) => {
  User.findOne({email: req.body.email})
    .exec()
    .then(user => {
      // No user with the same email in the database
      if (!user) {
        return res.json({
          emailNotTaken: true
        });
      }

      return res.json({
        emailNotTaken: false
      });
    })
    .catch(error => {
      return res.json({
        emailNotTaken: true
      });
    });
});

router.use('/', (req, res, next) => {
  jwt.verify(req.query.token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        title: 'Not Authenticated',
        error: error
      })
    }
    next();
  });
});

router.get('/user-info', (req, res, next) => {
  const decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id)
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({
          title: 'User does not exist',
          error: {
            message: 'The user cannot be found'
          }
        })
      }

      res.status(200).json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          lastViewedChannel: user.lastViewedChannel,
          isAdmin: user.isAdmin
      });
    })
    .catch(error => {
      res.status(404).json({
        title: 'User does not exist',
        error: error
      })
    });
});

module.exports = router;