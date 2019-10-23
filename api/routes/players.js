const express = require('express');
const router = express.Router();

const checkAuthentication = require('../middleware/check-authentication');
const playersController = require('../controllers/players');

router.get('/:playerId',checkAuthentication,playersController.get_player);

router.post("/login", playersController.login);

router.get('/',checkAuthentication,playersController.get_all_players);
    
router.post("/signup", playersController.signup);

router.put("/",checkAuthentication,playersController.update_player);

router.delete("/:playerId", checkAuthentication,playersController.delete_player);

module.exports = router