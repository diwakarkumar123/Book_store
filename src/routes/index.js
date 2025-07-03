const express = require('express')
const router = express.Router()

const user=require("./authRoutes")
const book=require("./book")
router.use('/',user)
router.use('/',book)




module.exports= router