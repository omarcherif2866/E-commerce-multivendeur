import express from 'express';
import { body } from "express-validator";
import { DeleteCategory, addOnceCategory, getAll, getCategoryById, putOnce } from '../controllers/category.js';


const router = express.Router();


router.route('/')
.get(getAll);

router.route('/AddCategory')
.post(
    addOnceCategory);


router.route('/:id')
.get(getCategoryById)
.delete(DeleteCategory)
.put(
    body("name").isLength({ min: 5 }),
    putOnce)



export default router;

