import express from 'express';
import * as returnsController from '../controllers/returns';

const router = express.Router();

router.get('/', returnsController.getAll);
router.get('/:id', returnsController.getSingle);
router.post('/', returnsController.createReturn);
router.put('/:id', returnsController.updateReturn);
router.delete('/:id', returnsController.deleteReturn);

export = router;