import express from 'express';
import multer from "../middlewares/multer-config.js";
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from '../middlewares/verifySignUp.js';
import { signup, signin, signout, getUserById, getUser, updateUserProfile,putPassword,
  getforgotPassword,postforgotPassword,getresetPassword,postresetPassword } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/auth.middleware.js';


const router = express.Router();

// router.use(verifyToken);

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

router.route('/signup')
.post(
    multer("image"),
    signup)



router.post("/signin", signin);

// router.post("/signout", signout);

router.get("/user/:id", getUserById);

router.get("/user", getUser);

// router.post('/logout', logout); 

router.route('/user/profile/:id')
.put(
    multer("image"),
    updateUserProfile)

router.route('/user/password/:id')
.put(
    putPassword)

router.route('/user/getforgot-password')
.get(getforgotPassword); //path postman : http://localhost:3000/auth/forgot-password
router.route('/user/getforgot-password')
.post(postforgotPassword);// http://localhost:3000/auth/forgot-password
     // http://localhost:3000/auth/messageavecsucces
    
router.route('/user/resetpassword/:id/:token')
.get(getresetPassword); //path postman : http://localhost:3000/auth/reset-password
router.route('/user/resetpassword/:id/:token')
.post(postresetPassword);  // http://localhost:3000/auth/reset-password

export default router;
