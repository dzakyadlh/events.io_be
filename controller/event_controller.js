const EventModel = require('../models/event');

// Find all events
exports.findEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.params;
    const skip = (page - 1) * limit;
    const events = await EventModel.find().limit(limit).skip(skip).exec();
    const count = await EventModel.countDocuments();
    res.status(200).json({
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
      date,
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
      !date ||
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
      date,
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
  try {
    const { id } = req.params;
    const {
      title,
      date,
      location,
      poster,
      quota,
      event_type,
      price,
      host,
      category,
      speakers,
      description,
      keypoints,
      requirements,
      agenda,
      faq,
    } = req.body;

    // Prepare update object
    const updateData = {
      $set: {},
      $currentDate: { updatedDate: true },
    };

    // Check each field and add to update object if provided
    if (title !== undefined) updateData.$set.title = title;
    if (date !== undefined) updateData.$set.date = date;
    if (location !== undefined) updateData.$set.location = location;
    if (poster !== undefined) updateData.$set.poster = poster;
    if (quota !== undefined) updateData.$set.quota = quota;
    if (event_type !== undefined) updateData.$set.event_type = event_type;
    if (price !== undefined) updateData.$set.price = price;
    if (host !== undefined) updateData.$set.host = host;
    if (category !== undefined) updateData.$set.category = category;

    // Update details only if any part is provided
    if (speakers || description || keypoints || requirements || agenda || faq) {
      updateData.$set.details = {};
      if (speakers !== undefined) updateData.$set.details.speakers = speakers;
      if (description !== undefined)
        updateData.$set.details.description = description;
      if (keypoints !== undefined)
        updateData.$set.details.keypoints = keypoints;
      if (requirements !== undefined)
        updateData.$set.details.requirements = requirements;
      if (agenda !== undefined) updateData.$set.details.agenda = agenda;
      if (faq !== undefined) updateData.$set.details.faq = faq;
    }

    const updatedEvent = await EventModel.updateOne({ _id: id }, updateData);

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
