import { conversationModel } from "../model/conversation.model.js";
import { messageModel } from "../model/message.model.js";
import { GetReceiverSocketId, io } from "../socket.js";

export const sendMessage = async (req, res) => {
  const senderID = req.user?._id?.toString();
  const receiverID = req.params.id;
  const { message } = req.body;

  let conversation = await conversationModel.findOne({
    members: { $all: [senderID, receiverID] },
  });

  if (!conversation) {
    conversation = await conversationModel.create({
      members: [senderID, receiverID],
    });
  }

  const newMessage = await messageModel.create({
    senderID,
    receiverID,
    message,
  });

  if (newMessage) {
    conversation.messages.push(newMessage?._id);
  }

  await conversation.save();

  const receiverSocketId = GetReceiverSocketId(receiverID);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.json({ status: true, newMessage });
};

export const getMessages = async (req, res) => {
  try {
    const senderID = req.user?._id?.toString();
    const receiverID = req.params.id;

    const conversation = await conversationModel
      .findOne({
        members: { $all: [senderID, receiverID] },
      })
      .populate("messages");

    if (conversation?.messages) {
      res.status(200).json({ status: true, messages: conversation?.messages });
    } else {
      res.status(400).json({ status: false, messages: "No message found" });
    }
  } catch (error) {
    res.status(400).json({ status: false, messages: "Internal server error" });
  }
};
