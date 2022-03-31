const express = require('express');
const router = express.Router();
const userController=require("../controller/userController")
const bookController = require("../controller/bookcontroller");
const reviewController = require('../controller/reviewController');
//const userModel = require("../model/userModel");
const middleware = require("../middleware/authentication");




router.post("/createUser",userController.createUser)
router.post("/login",userController.loginUser)
router.post("/createBook",middleware.authenticate,middleware.authorize,bookController.createBook)
router.get("/getAllBooks",middleware.authenticate,bookController.getAllBooks)
router.get('/getBooks/:bookId',middleware.authenticate,bookController.getBookById)
router.put('/updateBook/:bookId',middleware.authenticate,middleware.authorize,bookController.updateBook)
router.delete('/deleteByBookId/:bookId',middleware.authenticate,middleware.authorize,bookController.deleteByBookId)
router.post('/createReview/:bookId/review',reviewController.createReview)
router.put('/updateReview/:bookId/review/:reviewId',reviewController.updateReview)
router.delete('/deleteReview/:bookId/review/:reviewId',reviewController.deleteReview)


module.exports = router;