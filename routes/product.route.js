const exp = require('express');
const router = exp.Router();

const product_controller = require('../controllers/product.controller');

router.get('/p_route', product_controller.test);

module.exports = router;