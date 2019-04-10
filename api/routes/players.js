const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const checkAuthentication = require('../middleware/check-authentication');
const Player = require('../models/players.model');


router.get('/:playerId',checkAuthentication,(req,res,next)=>{
    const _id = req.params.playerId;
     Player.findById(_id).exec().then(result=>{
         if(result){
            res.status(200).json({
                message: "Player found successfully!",
                data:result});
         }else{
            res.status(404).json({
                message: "Player not found for that ID!"
            });
         }
        
     }).catch(err=>{
         res.status(404).json(err);
     })
});

router.post("/login", (req, res, next) => {
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
});

router.get('/',checkAuthentication,(req,res,next)=>{
      Player.find()
        .select("_id name lastName email")
        .exec()
        .then(docs => {
          const response = {
            count: docs.length,
            players: docs.map(doc => {
              return {
                _id: doc._id,
                name: doc.name,
                lastName: doc.lastName,
                email: doc.email
              };
            })
          };
          res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
              message:"Server Internal Error",
              error: err
            });
        });
}); 
    
router.post("/signup", (req, res, next) => {
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
});

router.put("/",checkAuthentication,(req, res,next) => {
    const id = req.body._id;
    const updateOps = {};
    if(req.body.name) updateOps.name = req.body.name;
    if(req.body.lastName) updateOps.lastName = req.body.lastName;
    if(req.body.email) updateOps.email = req.body.email;
    if(req.body.password){
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            updateOps.password = hash;
            Player.update({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
              console.log(result);
              res.status(201).json({
                message:"Player updated sucessfully!",
                data:updateOps});
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                message:"Server Internal Error",
                error:err});
            });
          }
        });
    } else{ 
      Player.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message:"Player updated sucessfully!",
          data:updateOps});
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message:"Server Internal Error",
          error:err});
      });
    }
});

router.delete("/:playerId", checkAuthentication,(req, res,next) => {
    const id = req.params.playerId;
    Player.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message:"Player successfully removed!",
            data:result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

module.exports = router