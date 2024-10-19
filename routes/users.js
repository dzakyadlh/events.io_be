const router = require('express').Router();
const user = require('../controller/user_controller');
const restrict = require('../middleware/restrict');

router.get('/', user.findUser);
router.get('/:id', user.findUserById);
router.post('/:user_id/wishlist', restrict, user.addWishlist);
router.post('/:user_id/register-event', restrict, user.registerEvent);
router.patch('/:id', restrict, user.updateUser);
router.delete('/:id', restrict, user.deleteUser);
router.delete('/:user_id/wishlist', restrict, user.removeWishlist);
router.delete('/:user_id/register-event', restrict, user.unregisterEvent);

module.exports = router;
