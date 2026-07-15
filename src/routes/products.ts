import express from 'express';
import * as productsController from '../controllers/products';

const router = express.Router();

router.get('/', productsController.getAll);
router.get('/:id', productsController.getSingle);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

export = router;