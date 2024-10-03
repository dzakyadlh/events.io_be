const router = require('express').Router();
const event = require('../controller/eventController');
const restrict = require('../middleware/restrict');

router.get('/', event.findEvents);
router.get('/:id', event.findEventById);
router.post('/', restrict, event.createEvent);
router.put('/:id', restrict, event.updateEvent);
router.delete('/:id', restrict, event.deleteEvent);

module.exports = router;
