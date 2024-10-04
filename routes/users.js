const router = require('express').Router();
const user = require('../controller/user_controller');
const restrict = require('../middleware/restrict');

router.get('/', user.findUser);
router.get('/:id', user.findUserById);
router.put('/:id', restrict, user.updateUser);
router.delete('/:id', restrict, user.deleteUser);

module.exports = router;
