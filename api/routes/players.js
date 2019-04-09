const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require("bcrypt");

const Player = require('../models/players.model');


router.get('/:playerId',(req,res)=>{
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


router.get('/',(req,res)=>{
        Player.findAll().exec().then(result=>{
             if(result){
                res.status(200).json({
                    message: "Players returned successfully!",
                    data:result});
             }else{
                res.status(404).json({
                    message: "There are no Players registered!"
                });
             }
            
         }).catch(err=>{
             res.status(500).json({
                message:"Internal server error!",
                error: err
                });
         });
});
    
    
router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(422).json({
            message: "Invalid email address, it already exists!"
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
              const player = new User({
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
                    message: "Player signed up successfully!"
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        }
      });
  });

router.put('/player',(req,res)=>{
    const player = new Player({
        _id: req.body._id,
        name:req.body.name,
        lastName:req.body.lastName,
        email:req.body.email,
        password:req.body.isAdmin
    });

    player.save().then(result=>{
        res.status(201).json({
            message: "Handling POST request to /player.",
            data: result
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            message:"Internal server error!",
            error: err
        });
    });

});

router.put("/", (req, res) => {
    const id = req.body._id;
    const updateOps = {};
    if(req.body.name) updateOps.name = req.body.name;
    if(req.body.lastName) updateOps.lastName = req.body.lastName;
    if(req.body.email) updateOps.email = req.body.email;
    if(req.body.password) updateOps.password = req.body.password;
    Player.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json({
            message:"Player successfully updated!",
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

router.delete("/:playerId", (req, res) => {
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