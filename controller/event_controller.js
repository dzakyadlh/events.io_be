const mongoose = require('mongoose');
const EventModel = require('../models/event');

// Find all events
exports.findEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, title } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (page - 1) * limit;

    const query = {};
    if (category) {
      query.category = { $regex: new RegExp(`${category}`, 'i') };
    }
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }

    const events = await EventModel.find(query)
      .sort({ startDate: -1 })
      .limit(limitNumber)
      .skip(skip)
      .exec();
    const count = await EventModel.countDocuments();
    res.status(200).json({
      message: 'Events data fetched successfully',
      data: events,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

// Find event by ID
exports.findEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await EventModel.findById(id).populate('host');

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
      start_time,
      end_time,
      location,
      poster,
      quota,
      event_type,
      price,
      host,
      category,
      details,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !start_time ||
      !end_time ||
      !location ||
      !event_type ||
      !host ||
      !category ||
      !details
    ) {
      return res
        .status(400)
        .json({ message: 'Some fields cannot be left empty' });
    }

    const newEvent = new EventModel({
      title,
      start_time,
      end_time,
      location,
      poster,
      quota,
      event_type,
      price,
      host,
      category,
      details: {
        speakers: details.speakers,
        description: details.description,
        keypoints: details.keypoints,
        requirements: details.requirements,
        agenda: details.agenda,
        faq: details.faq,
      },
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({ message: 'Event created', data: savedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const user_id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  try {
    // Fetch the current event
    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.host.toString() !== user_id.toString()) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to update this event' });
    }

    // Merge updates with current values
    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      { $set: { ...event.toObject(), ...updates } },
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json({ message: 'Event updated successfully', data: updatedEvent });
  } catch (error) {
    res.status(400).json({ message: 'Invalid updates', error });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user._id;

    const event = await EventModel.findById(id);

    if (event.host.toString() !== user_id.toString()) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this event' });
    }

    const deletedEvent = await EventModel.deleteOne({ _id: id });

    res.status(200).json({ message: 'Event deleted', deletedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};
