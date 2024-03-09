import express from 'express';
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";
import { addOnceProduct, getAll, getProductById, putOnce,Deleteproduct,getAllProducts, getProductByVendor, getProductsByCategory, getAttributeByCategory, getProductsByVendorAndStatus } from '../controllers/Product.js';


const router = express.Router();




router.route('/')
.get(getAllProducts);

router.route('/categories/:categoryId')
.get(getProductsByCategory);

router.route('/:id')
.get(getProductById)
.delete(Deleteproduct)
.put(
    multer("image"),
    // body("name").isLength({ min: 5 }),
    // body("price").isInt(),
    // body("quantity").isInt(),    
    // body("description").isLength({ min: 10 }),
    putOnce)
    
// router.route('/vendorproduct/:vendorId')
// .get(getProductByVendor)

router.route('/venodrProduct/:vendorId')
.get(getProductByVendor)
.post(
    multer("image"),
//    body("name").isLength({ min: 5 }),
//    body("price").isInt(),
//    body("quantity").isInt(),    
//    body("description").isLength({ min: 10 }),
   addOnceProduct)


router.route('/:categoryId/attributes')
.get(getAttributeByCategory)

router.route('/venodrProduct/status/:vendorId')
.get(getProductsByVendorAndStatus)

export default router;

