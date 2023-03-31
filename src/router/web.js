const express = require('express');
const router = express.Router();
const AuthController = require('../apps/controllers/Auth');
const UserController = require('../apps/controllers/User');
const ParkController = require('../apps/controllers/Park');
const CardController = require('../apps/controllers/Card');
const path = require('path');
const Control = require('../apps/controllers/Control');

//GET

router.get('/', Control.index)
router.get('/login', AuthController.getLogin) 
router.get('/register', AuthController.getRegister)
router.get('/logout', AuthController.getLogout)
router.get('/account', UserController.indexUser)
router.get('/account/add', UserController.addUser)
router.get('/account/delete/:id', UserController.deleteUser)
router.get('/account/edit/:id', UserController.editUser)
router.get('/account/export', UserController.exportEx)
router.get('/parking-list', ParkController.indexPark)
router.get('/parking-list/add', ParkController.addPark)
router.get('/parking-list/delete/:id', ParkController.deletePark)
router.get('/parking-list/edit/:id', ParkController.editPark)
router.get('/parking-list/export', ParkController.exportEx)
router.get('/card', CardController.indexCard)
router.get('/card/add-card', CardController.addCards)
router.get('/card/remove-card', CardController.getRemoveCard)
router.get('/card/export', CardController.exportEx)
router.get('/car', (res, req) => {
    if(loggedIn) {
        req.render('car');
    }
    else {
        req.redirect('/login')
    }
    
  })

//POST
router.post('/login', AuthController.postLogin)
router.post('/register', AuthController.postRegister)
router.post('/account/add', UserController.newUser)
router.post('/account/edit/:id', UserController.updateUser)
router.post('/parking-list/add', ParkController.newPark)
router.post('/parking-list/edit/:id', ParkController.updatePark)
router.post('/card/add-card', CardController.newCards)
router.post('/card/remove-card', CardController.deleteCard)

module.exports = router