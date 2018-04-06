const express =require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

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

router.patch('/:userId', (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      updateOps[key] = req.body[key];
    }
  }
  User.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'The user has been successfully updated'
      });
    })
    .catch(error => {
      res.status(500).json({
        title: 'An error occurred',
        error: error
      })
    });
});

module.exports = router;