const userModel = require("../models/userModel");
const logger = require("../utils/logger"); 

const getUserInfo = async (req, res) => {
	const userId = req.user.userId;
  try {
    const getUser = await userModel.findUserByUserId(userId);

    if (!getUser) {
       logger.warn({ userId }, "User not found");
      return res.status(404).json({ error: "User not found" });
    }
      logger.info({ userId }, "Fetched user info successfully");
    res.status(200).json(getUser);
  } catch (err) {
    logger.error({ err, userId }, "Error fetching user info");
    res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = {
	getUserInfo,
};
