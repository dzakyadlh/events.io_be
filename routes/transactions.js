const router = require('express').Router();
const transaction = require('../controller/transaction_controller');
const restrict = require('../middleware/restrict');

router.get('/:userId', transaction.findTransactionsByUserId);
router.post('/', transaction.addTransaction);

module.exports = router;
