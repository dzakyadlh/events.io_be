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
    default: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/users/default.png?t=2024-10-04T16%3A11%3A44.895Z`,
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
