const mongoose = require('mongoose');
const EventModel = require('./event');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  is_host: {
    type: Boolean,
    default: false,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  wishlist: [
    {
      type: Schema.Types.ObjectId, // Store only the event's ObjectId
      ref: 'events', // Referencing the Event model
    },
  ],
  registered_events: [
    {
      type: Schema.Types.ObjectId, // Store only the event's ObjectId
      ref: 'events', // Referencing the Event model
    },
  ],
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
