import express from 'express';

const router = express.Router();

router.use('/', require('./swagger'));
router.use('/products', require('./products'));
router.use('/returns', require('./returns'));
router.use('/ledgers', require('./ledgers'));
router.use('/users', require('./users'));

export = router;