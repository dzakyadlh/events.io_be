const router = require('express').Router();
const event = require('../controller/event_controller');
const restrict = require('../middleware/restrict');
const isAdmin = require('../middleware/admin');
const isHost = require('../middleware/host');

router.get('/', event.findEvents);
router.get('/:id', event.findEventById);
router.post('/', restrict, isHost, event.createEvent);
router.patch('/:id', restrict, isHost, event.updateEvent);
router.delete('/:id', restrict, isHost, event.deleteEvent);

module.exports = router;
