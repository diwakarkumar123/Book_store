const express = require('express')
const router = express.Router()
const userapi = require("../controllers/authController")
// const { userAuth } = require('../middlewares/auth')


router.post('/register', userapi.register)
router.post('/login', userapi.login)

// router.get('/diwakar',(req, res) => {
//   console.log('Route /hello called diwakar');
//   res.send({ message: 'hello user I am here dkkkk' });
// })



module.exports= router
