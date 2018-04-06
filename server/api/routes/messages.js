const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Message = require('../../models/message');
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

router.post('/', (req, res, next) => {
  const decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id)
    .exec()
    .then(user => {
      const message = new Message({
        _id: new mongoose.Types.ObjectId(),
        createdBy: user,
        createdAt: req.body.createdAt,
        body: req.body.body,
        channel: req.body.channel
      });

      message.save()
        .then(newMessage => {
          // Populate the createdBy field
          const opts = [
            { path: 'createdBy', select: ['_id', 'firstName', 'lastName'] }
          ];
          Message.populate(newMessage, opts)
            .then(newMessage => {
              res.status(201).json({
                message: 'Message created',
                obj: newMessage
              });
            })
            .catch(error => {
              console.log('error: ' + error.message);
              res.status(500).json({
                title: 'An error occurred',
                error: error
              });
            });
        })
        .catch(error => {
          console.log('error: ' + error.message);
          res.status(500).json({
            title: 'An error occurred',
            error: error
          })
        });
    })
    .catch(error => {
      console.log('error: ' + error.message);
      res.status(500).json({
        title: 'An error occurred',
        error: error
      })
    });
});

router.get('/channels/:channelId/', (req, res, next) => {
  const channelId = req.params.channelId;
  Message.find({channel: channelId})
    .populate('createdBy', ['_id', 'firstName', 'lastName', 'isAdmin'])
    .exec()
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(error => {
      res.status(500).json({
        title: 'An error occurred',
        error: error
      })
    })
});

router.delete('/:messageId', (req, res, next) => {
  const decoded = jwt.decode(req.query.token);
  const loggedInUserId = decoded.user._id;

  // Only an existing message can be deleted
  Message.findById(req.params.messageId)
    .exec()
    .then(message => {
      if (!message) {
        return res.status(404).json({
          title: 'This message does not exist',
          error: {
            message: 'This message does not exist.'
          }
        });
      }

      // Only the message author can delete his/her message
      if ((loggedInUserId != message.createdBy) && !decoded.user.isAdmin) {
        return res.status(422).json({
          title: 'The message can not be deleted',
          error: {
            message: 'You do not have the permission to delete this message.'
          }
        });
      }

      // Delete the message
      Message.remove({_id: req.params.messageId})
        .exec()
        .then(result => {
          res.status(200).json({
            message: 'Message deleted',
            deletedMessage: message
          });
        })
        .catch(error => {
          res.status(500).json({
            title: 'An error occurred',
            error: error
          })
        });
    })
    .catch(error => {
      res.status(500).json({
        title: 'The message can not be deleted',
        error: error
      });
    });
});

module.exports = router;