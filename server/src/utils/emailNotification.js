import Notification from "../models/notification.js";

export const emailNotification = async ( io, to , from, type , message, data ) => {
    const notification = await Notification.create({
        to, from, type, message, data,
    });

    io.to(toString()).emit("newNotification", notification);
}