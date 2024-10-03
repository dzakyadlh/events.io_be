const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
  },
  host_user_id: {
    type: String,
    required: true,
  },
  category_id: {
    type: String,
    required: true,
  },
});

const EventModel = mongoose.model('events', EventSchema);

module.exports = EventModel;
