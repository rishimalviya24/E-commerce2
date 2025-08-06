import Notification from "../models/notification.js";

//create Notification --------
export const createNotification = async (req, res) => {
  try {
    const { to, type, message, data } = req.body;

    const notification = await Notification.create({
      to,
      type,
      message,
      data,
      from: req.user?._id || null, //optional
    });

    //Emit real-time notification (if using socket.io and user is connected)
    if (global.io) {
      global.io.to(to.toString()).emit("notification", notification);
    }

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User's Notification -----------
export const getNotifications = async (req, res) => {
  try {
    const notification = await Notification.find({ to: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Mark single Notification as Read -----------------
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (
      !notification ||
      notification.to.toString() !== req.user._id.toString()
    ) {
      return res
        .status(404)
        .json({ message: "Notification not found or unauthorised" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(500).json({ error: err.message });
  } catch (err) {
    res.status(200).json({ message: "Notification marked as read" });

  }
};

//Mark All as READ ----------------
export const markAllAsRead = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      //Mark all admin notification as READ
      await Notification.updateMany(
        { to: "admin", isRead: false },
        { $set: { isRead: true } }
      );
    } else {
      //Mark all user-specific notification as read
      await Notification.updateMany(
        { to: req.user._id, isRead: false },
        { $set: { isRead: true } }
      );
    }
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
