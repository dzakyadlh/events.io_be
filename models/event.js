const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v >= new Date();
      },
      message: (props) => `Event date ${props.value} cannot be in the past!`,
    },
  },
  location: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    default: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/events/default.jpg?t=2024-10-04T16%3A10%3A30.532Z`,
  },
  quota: {
    type: Number,
    default: 999,
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: (props) => `${props.value} is not a valid price!`,
    },
  },
  price: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: (props) => `${props.value} is not a valid price!`,
    },
  },
  event_type: {
    type: String,
  },
  host_name: {
    type: String,
    required: true,
  },
});

const EventModel = mongoose.model('events', EventSchema);

module.exports = EventModel;
