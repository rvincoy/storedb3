const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // user is authenticated
  }
  return res.status(401).send('Unauthorized');
}

router.use('/api-docs', requireAuth, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;