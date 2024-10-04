const EventModel = require('../models/event');

// Find all events
exports.findEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.params;
    const skip = (page - 1) * limit;
    const events = await EventModel.find().limit(limit).skip(skip).exec();
    const count = await EventModel.countDocuments();
    res
      .status(200)
      .json({
        message: 'Events data fetched successfully',
        data: events,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

// Find event by ID
exports.findEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res
      .status(200)
      .json({ message: 'Event data fetched successfully', data: event });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      poster,
      host_user_id,
      category_id,
    } = req.body;

    const newEvent = new EventModel({
      title,
      description,
      date,
      location,
      poster,
      host_user_id,
      category_id,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({ message: 'Event created', data: savedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      location,
      poster,
      host_user_id,
      category_id,
    } = req.body;

    const updatedEvent = await EventModel.updateOne(
      { _id: id },
      {
        $set: {
          title,
          description,
          date,
          location,
          poster,
          host_user_id,
          category_id,
        },
        $currentDate: { updatedDate: true },
      }
    );

    if (updatedEvent.nModified === 0) {
      return res
        .status(404)
        .json({ message: 'Event not found or no changes detected' });
    }

    res.status(200).json({ message: 'Event updated', data: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await EventModel.deleteOne({ _id: id });

    if (deletedEvent.deletedCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted', data: deletedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};
