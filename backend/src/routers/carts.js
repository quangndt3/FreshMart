import express from 'express';
import { addToCart, cartLocal, getCart, removeAllProductInCart, removeOneProductInCart, updateProductWeightInCart } from '../controllers/carts';
import authentication from '../middleware/authentication';
const router = express.Router();

router.post('/cart', authentication,addToCart);
router.patch('/cart', authentication,updateProductWeightInCart);
router.get('/cart', authentication,getCart);
router.delete('/cart/:id', authentication,removeOneProductInCart);
router.delete('/cart/', authentication,removeAllProductInCart);
router.post('/cart-local/',cartLocal);

export default router;