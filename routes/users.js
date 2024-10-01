const router = require('express').Router();
const user = require('../controller/userController');
const restrict = require('../middleware/restrict');

router.get('/', user.find);
router.get('/:id', restrict, user.findOne);
router.put('/:id', restrict, user.update);

module.exports = router;
