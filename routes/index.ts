import express from 'express';
import swaggerRoutes from './swagger';
import productsRoutes from './products';
import returnsRoutes from './returns';
import ledgersRoutes from './ledgers';
import usersRoutes from './users';

const router = express.Router();

router.use('/', swaggerRoutes);
router.use('/products', productsRoutes);
router.use('/returns', returnsRoutes);
router.use('/ledgers', ledgersRoutes);
router.use('/users', usersRoutes);

export default router;
