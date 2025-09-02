const { Message, Conversation } = require("../../model/message");

class MessageController{


// Create new conversation
async createConversation (req, res){
  try {
    const { workspaceId, participantIds, isGroup, name } = req.body;

    const conversation = await Conversation.create({
      workspaceId,
      participantIds,
      isGroup,
      name,
      createdBy: req.user._id
    });

    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get conversations for logged-in user
async getUserConversations (req, res)  {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participantIds: userId
    }).sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send message
async sendMessage (req, res){
  try {
    const { convoId, type, body, mediaRef, reaction } = req.body;

    const message = await Message.create({
      convoId,
      senderId: req.user._id,
      type,
      body,
      mediaRef,
      reaction,
      readBy: [req.user._id]
    });

    // update lastMessage in conversation
    await Conversation.findByIdAndUpdate(convoId, {
      lastMessage: message._id,
      updatedAt: Date.now()
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get all messages in a conversation
async getMessagesByConversation (req, res){
  try {
    const { convoId } = req.params;

    const messages = await Message.find({ convoId }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark messages as read
async markMessageAsRead  (req, res)  {
  try {
    const { convoId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      { convoId, readBy: { $ne: userId } },
      { $push: { readBy: userId } }
    );

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

}
module.exports=new MessageController()