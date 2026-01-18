const express = require('express');
const MessageTemplateController = require('../controllers/messageTemplateController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/all',
  authMiddleware,
  MessageTemplateController.getAllMessageTemplates
);
router.post(
  '/',
  authMiddleware,
  MessageTemplateController.createMessageTemplate
);
router.put(
  '/:id',
  authMiddleware,
  MessageTemplateController.updateMessageTemplate
);
router.delete(
  '/:id',
  authMiddleware,
  MessageTemplateController.deleteMessageTemplate
);
router.delete(
  '/',
  authMiddleware,
  MessageTemplateController.deleteAllMessageTemplate
);

module.exports = router;
