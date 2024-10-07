const router = require('express').Router();
const event = require('../controller/event_controller');
const restrict = require('../middleware/restrict');
const isAdmin = require('../middleware/admin');

router.get('/', event.findEvents);
router.get('/:id', event.findEventById);
router.post('/', restrict, isAdmin, event.createEvent);
router.put('/:id', restrict, isAdmin, event.updateEvent);
router.delete('/:id', restrict, isAdmin, event.deleteEvent);

module.exports = router;
