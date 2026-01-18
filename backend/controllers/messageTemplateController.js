const messageTemplateModel = require('../models/messageTemplateModel');
const {
  validateMessageTemplate,
} = require('../validations/messageTemplateValidator');
const { snakeToCamel } = require('../utils/helpers');

const messageTemplateController = {
  getAllMessageTemplates: async (req, res) => {
    try {
      const messageTemplates =
        await messageTemplateModel.getAllMessageTemplates();
      res.json(messageTemplates.map((item) => snakeToCamel(item)));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createMessageTemplate: async (req, res) => {
    const { error } = validateMessageTemplate(req.body);

    // Check if validation failed
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const {
      message,
      messageLength,
      translatedMessage,
      fontFamily,
      isBold,
      isItalic,
      isUnderlined,
      fontSize,
      color,
      backgroundColor,
      effect,
      stopOver,
      translatedMesBefore,
    } = req.body;
    try {
      const newMessageTemplate =
        await messageTemplateModel.createMessageTemplate(
          message,
          messageLength,
          translatedMessage,
          fontFamily,
          isBold,
          isItalic,
          isUnderlined,
          fontSize,
          color,
          backgroundColor,
          effect,
          stopOver,
          translatedMesBefore
        );
      res.status(201).json(snakeToCamel(newMessageTemplate));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateMessageTemplate: async (req, res) => {
    const { error } = validateMessageTemplate(req.body);

    // Check if validation failed
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const {
      message,
      messageLength,
      translatedMessage,
      fontFamily,
      isBold,
      isItalic,
      isUnderlined,
      fontSize,
      color,
      backgroundColor,
      effect,
      stopOver,
      translatedMesBefore,
    } = req.body;
    try {
      const updatedMessageTemplate =
        await messageTemplateModel.updateMessageTemplate(
          req.params.id,
          message,
          messageLength,
          translatedMessage,
          fontFamily,
          isBold,
          isItalic,
          isUnderlined,
          fontSize,
          color,
          backgroundColor,
          effect,
          stopOver,
          translatedMesBefore
        );
      if (!updatedMessageTemplate) {
        return res.status(404).json({ message: 'MessageTemplate not found' });
      }
      res.json(snakeToCamel(updatedMessageTemplate));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteMessageTemplate: async (req, res) => {
    try {
      const deletedMessageTemplate =
        await messageTemplateModel.deleteMessageTemplate(req.params.id);
      if (!deletedMessageTemplate) {
        return res.status(400).json({ message: 'MessageTemplate not found' });
      }
      res.json(snakeToCamel(deletedMessageTemplate));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteAllMessageTemplate: async (req, res) => {
    try {
      const deletedMessageTemplates =
        await messageTemplateModel.deleteAllMessageTemplate(req.params.id);
      if (!deletedMessageTemplates) {
        return res.status(404).json({ message: 'MessageTemplate not found' });
      }
      res.json(deletedMessageTemplates.map((item) => snakeToCamel(item)));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = messageTemplateController;
