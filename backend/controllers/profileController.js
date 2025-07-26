const userModel = require("../models/userModel");


const getUserInfo = async (req, res) => {
	const userId = req.user.userId;
  try {
    const getUser = await userModel.findUserByUserId(userId);

    if (!getUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(getUser);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = {
	getUserInfo,
};
