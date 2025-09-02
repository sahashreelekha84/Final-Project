const express = require("express");
const router = express.Router();
const chatController = require("../../controller/api/MessageController");
const { Authcheck } = require("../../middleware/AuthCheck");


// Conversations
router.post("/conversations", Authcheck, chatController.createConversation);
router.get("/conversations/:workspaceId", Authcheck, chatController.getUserConversations);


// Messages
router.post("/messages", Authcheck, chatController.sendMessage);
router.get("/messages/:convoId", Authcheck, chatController.getMessagesByConversation);
router.patch("/messages/:convoId/read", Authcheck, chatController.markMessageAsRead);

module.exports = router;
