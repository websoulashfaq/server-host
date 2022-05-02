import express from 'express';
const router = express.Router();

//controllers 
import { privet, signIn, signup, sendOTPToMail, ResetPassword } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js'

//@POST
//Register Router
//Public
router.post('/signup', signup)


//@POST
//Login Router
//Public
router.post('/signin', signIn)

//@GET
//Home Router
//Privet
router.get('/privet', protect, privet)

//@POST
//Email Send Router
//Public
router.post('/sent-to-eamil', sendOTPToMail)

//@POST
//Reset Password Router
//Privet
router.post('/reset-password/:id', ResetPassword)


export default router;