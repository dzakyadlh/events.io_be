const EventModel = require('../models/event');
const UserModel = require('../models/user');
const mongoose = require('mongoose');

exports.findUser = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const count = await UserModel.countDocuments();

    const users = await UserModel.find()
      .limit(Number(limit))
      .skip(Number(skip));

    res.status(200).json({
      message: 'Users data fetched successfully',
      data: users,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to show users data',
      error,
    });
  }
};

exports.findUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id)
      .populate('wishlist')
      .populate({
        path: 'registered_events',
        populate: {
          path: 'host',
          model: 'users',
        },
      });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }

    res
      .status(200)
      .json({ message: 'User data fetched successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user data', error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { updates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...user.toObject(),
          ...updates,
        },
      },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ message: 'User data updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user data', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.deleteOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete data user', error });
  }
};

exports.addWishlist = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { event_id } = req.body;

    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const event = await EventModel.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (user.wishlist.includes(event_id)) {
      return res
        .status(400)
        .json({ message: 'Event is already in the wishlist' });
    }

    user.wishlist.push(event_id);
    await user.save();

    res.status(200).json({ message: 'Event added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add event to wishlist', error });
  }
};

exports.removeWishlist = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { event_id } = req.body;

    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const event = await EventModel.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!user.wishlist.includes(event_id)) {
      return res.status(400).json({ message: 'Event is not in the wishlist' });
    }

    user.wishlist.pull(event_id);
    await user.save();

    res.status(200).json({ message: 'Event removed from wishlist' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to remove event from wishlist', error });
  }
};

exports.registerEvent = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { event_id } = req.body;

    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const event = await EventModel.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (user.registered_events.includes(event_id)) {
      return res
        .status(400)
        .json({ message: 'You have already registered to the event' });
    }

    user.registered_events.push(event_id);
    event.registered_users.push(user_id);

    await user.save();
    await event.save();

    res
      .status(200)
      .json({ message: 'User successfully registered', user, event });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to register user to the event', error });
  }
};

exports.unregisterEvent = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { event_id } = req.body;

    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const event = await EventModel.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!user.registered_events.includes(event_id)) {
      return res.status(400).json({ message: 'User is not registered' });
    }

    user.registered_events.pull(event_id);
    event.registered_users.pull(user_id);

    await user.save();
    await event.save();

    res.status(200).json({
      message: 'Successfully unregistered from the event',
      user,
      event,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to unregister from the event', error });
  }
};
