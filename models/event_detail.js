const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventDetailSchema = new Schema({
  speakers: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keypoints: {
    type: [String],
    default: [],
  },
  requirements: {
    type: [String],
    default: [],
  },
  agenda: {
    type: [String],
    default: [],
  },
  faq: {
    type: [String],
    default: [],
  },
});

module.exports = EventDetailSchema;
