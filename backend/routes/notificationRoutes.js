const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");

// Get notifications for a user
router.get("/users/:userId/notifications", async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "name username")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).send("Something Went Wrong");
  }
});

// Mark notification as read
router.post("/notifications/:notificationId/read", async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).send("Something Went Wrong");
  }
});

module.exports = router;
