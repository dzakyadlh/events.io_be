const router = require('express').Router();
const event = require('../controller/event_controller');
const restrict = require('../middleware/restrict');
const isAdmin = require('../middleware/admin');

router.get('/', event.findEvents);
router.get('/:id', event.findEventById);
router.post('/', event.createEvent);
router.patch('/:id', event.updateEvent);
router.delete('/:id', event.deleteEvent);

module.exports = router;
