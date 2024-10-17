const UserModel = require('../models/user');

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
      error: error.message || error,
    });
  }
};

exports.findUserById = async (req, res) => {
  try {
    const { id } = req.params;
    await UserModel.findById(id).then((data) => {
      res.status(200).json({ message: 'User data fetched successfully', data });
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user data', error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name } = req.body;
    await UserModel.updateOne(
      { _id: id },
      {
        $set: {
          first_name: first_name,
          last_name: last_name,
        },
        $currentDate: { lastUpdated: true },
      }
    ).then((data) => {
      res.status(200).json({ message: 'User data updated successfully', data });
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user data', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await UserModel.deleteOne({ _id: id }).then((data) => {
      res.status(200).json({ message: 'User deleted successfully', data });
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete data user', error });
  }
};
