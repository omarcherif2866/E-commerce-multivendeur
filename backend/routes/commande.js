import express from 'express';

import { createCommande, getAllCommande, getCommandeById } from '../controllers/commande.js';


const router = express.Router();







router.post('/create/:clientId', createCommande);

router.route('/:commandeId')
.get(getCommandeById);

router.route('/')
.get(getAllCommande)


export default router;
