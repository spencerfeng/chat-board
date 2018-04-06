const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Channel = require('../../models/channel');
const User = require('../../models/user');
const Message = require('../../models/message');

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

router.get('/', (req, res, next) => {
  const decoded = jwt.decode(req.query.token);
  Channel.find()
    .exec()
    .then(channels => {
      res.status(200).json(channels);
    })
    .catch(error => {
      res.status(500).json({
        title: 'An error occurred',
        error: error
      });
    });
});

router.post('/', (req, res, next) => {
  const decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id)
    .exec()
    .then(user => {
      // Check if the channel name is unique
      Channel.findOne({name: req.body.name})
        .exec()
        .then(channel => {
          if (channel) {
            return res.status(422).json({
              title: 'Channel can not be created',
              error: {
                message: 'This channel name has been taken'
              }
            });
          }

          const newChannel = new Channel({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            createdBy: req.body.name === 'general' ? null : user,
            deletable: req.body.deletable,
            isDefault: req.body.name === 'general',
            createdAt: req.body.createdAt
          });

          newChannel.save()
            .then(result => {
              res.status(201).json({
                message: 'Channel created',
                obj: result
              });
            })
            .catch(error => {
              res.status(500).json({
                title: 'An error occurred',
                error: error
              });
            });
        })
        .catch(error => {
          res.status(500).json({
            title: 'An error occurred',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        title: 'An error occurred',
        error: error
      })
    });
});

router.delete('/:channelId', (req, res, next) => {
  const decoded = jwt.decode(req.query.token);
  if (!decoded.user.isAdmin) {
    return res.status(401).json({
      title: 'The channel can not be deleted',
      error: {
        message: 'Sorry, you do not have the permission to delete a channel.'
      }
    });
  }

  Channel.findById(req.params.channelId)
    .exec()
    .then(channel => {
      if (!channel) {
        return res.status(404).json({
          title: 'The channel can not be deleted',
          error: {
            message: 'Sorry, this channel does not exist.'
          }
        });
      }

      // The channel can be deleted when reaching this point

      // Delete all messages in this channel
      Message.remove({channel: channel._id})
        .exec()
        .then(result => {
          Channel.remove({_id: channel._id})
            .exec()
            .then(result => {
              return res.status(200).json({
                message: 'Channel and all its messages have been deleted',
                deletedChannel: channel
              });
            })
            .catch(error => {
              // todo - issue: when reaching this point, messages belonging to this channel have been deleted
              return res.status(500).json({
                title: 'The channel can not be deleted',
                error: error
              });
            });
        })
        .catch(error => {
          return res.status(500).json({
            title: 'The channel can not be deleted',
            error: error
          });
        });
    })
    .catch(error => {
      return res.status(500).json({
        title: 'The channel can not be deleted',
        error: error
      });
    });
});

module.exports = router;