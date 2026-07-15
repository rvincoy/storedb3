import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

const router = express.Router();

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send('Unauthorized');
}

router.use('/api-docs', requireAuth, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export = router;