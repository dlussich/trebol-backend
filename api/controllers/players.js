const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Player = require('../models/players.model');

exports.get_all_players = (req,res,next)=>{
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
}; 

exports.get_player = (req,res,next)=>{
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
};

exports.update_player = (req, res,next) => {
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
};

exports.delete_player = (req, res,next) => {
    
     const _id =req.params.playerId; 
     Player.findById(_id).exec().then(result=>{
      if(result){
          Player.deleteOne({ _id: _id })
            .exec()
            .then(data => {
                res.status(200).json({
                  message:"Player successfully removed!",
                  data:data
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
            });

      }else{
         res.status(404).json({
             message: "Player not found for that ID!"
         });
      }
     
  }).catch(err=>{
      res.status(404).json(err);
  });
};