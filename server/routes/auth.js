const express = require('express');
const { signup,signin, google, signout } = require('../controllers/auth');

const router = new express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google', google)
router.get('/signout', signout)

module.exports = router