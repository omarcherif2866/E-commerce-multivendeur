import express from 'express';
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";

import { addOnceClient, signInClient} from '../controllers/Clients.js'


const router = express.Router();
router
  .route('/:idc/:idp')
  .get(buyGame);
  
export default router;

