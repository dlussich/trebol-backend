const express = require('express');
const router = express.Router();

const checkAuthentication = require('../middleware/check-authentication').jwt_authentication;
const playersController = require('../controllers/players');

router.get('/:playerId',checkAuthentication,playersController.get_player);

router.get('/',checkAuthentication,playersController.get_all_players);

router.put("/",checkAuthentication,playersController.update_player);

router.delete("/:playerId", checkAuthentication,playersController.delete_player);

module.exports = router