import express from 'express';
import { DeleteOrder, getAllOrders, getOrderByClient, getOrderById, getOrdersByCommande, getOrdersByVendor, putOnceOrder} from '../controllers/order.js';



const router = express.Router();



router.route('/')
.get(getAllOrders)

router.route('/orderByClient/:clientId')
.get(getOrderByClient)

router.route('/:id')
.put(putOnceOrder)
.get(getOrderById)
.delete(DeleteOrder)


router.route('/commande/:commandeId')
.get(getOrdersByCommande)

router.route('/vendor/:vendorId')
.get(getOrdersByVendor)


export default router;
