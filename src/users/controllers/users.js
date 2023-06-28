const { User } = require("../services");
exports.getUser = async (req, res, next) => {
  try {
    const userService = new User();
    const { id } = req.params;
    const user = await userService.getUser({ _id: id });
    res.status(200).json({ message: "User retrived.", details: { user } });
  } catch (error) {
    next(error);
  }
};

exports.updateProfileInformation = async (req, res, next) => {
  try {
    const userService = new User();
    const { id } = req.params;
    const user = await userService.updateProfileInformation(id, req.body);
    res.status(200).json({ message: "User updated.", details: { user } });
  } catch (error) {
    next(error);
  }
};

exports.updateProfileImage = async (req, res, next) => {
  try {
    const userService = new User();
    const { id } = req.params;
    const user = await userService.updateProfileImage(id, req.body);
    res
      .status(200)
      .json({ message: "User profile image updated.", details: { user } });
  } catch (error) {
    next(error);
  }
};

exports.updateActivityStatus = async (req, res, next) => {
  try {
    const userService = new User();
    const { id } = req.params;
    const user = await userService.updateActivityStatus(id, req.body);
    res
      .status(200)
      .json({ message: "User activitty status updated.", details: { user } });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userService = new User();
    const { id } = req.params;
    const user = await userService.changePassword(id, req.body);
    res.status(200).json({
      message: "Password changed.",
      details: { user },
    });
  } catch (error) {
    next(error);
  }
};
