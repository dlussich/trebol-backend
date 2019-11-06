const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Player = require('../models/players.model');

exports.login = (req, res, next) => {
    Player.find({ email: req.body.email })
      .exec()
      .then(player => {
          if (player.length < 1) {
            return res.status(401).json({
              message: "Authentication failed!!"
            });
          }
        bcrypt.compare(req.body.password, player[0].password, (err, result) => {
          if (err) {
              return res.status(401).json({
                message: "Authentication failed!"
              });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: player[0].email,
                playerId: player[0]._id
              },
              process.env.JWT_KEY,
              {
                  expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "Authentication successful!",
              token: token
            });
          }
          res.status(401).json({
            message: "Authentication failed!"
          });
        });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
      });
};

exports.signup = (req, res, next) => {
    Player.find({ email: req.body.email })
      .exec()
      .then(player => {
        if (player.length >= 1) {
          return res.status(422).json({
            message: "Invalid email address, it already exists!"
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                message:"Server Internal Error",
                error: err
              });
            } else {
                const player = new Player({
                  _id: new mongoose.Types.ObjectId(),
                  name: req.body.name,
                  lastName: req.body.lastName,
                  email: req.body.email,
                  password: hash
                });

                player.save()
                  .then(result => {
                    console.log(result);
                    res.status(201).json({
                      message: "Player signed up successfully!",
                      data: result
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    res.status(500).json({
                      message:"Server Internal Error",
                      error: err
                    });
                  });
            }
          });
        }
      });
};