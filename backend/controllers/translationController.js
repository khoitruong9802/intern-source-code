const translationService = require('../services/translationService');

const translationController = {
  translateText: async (req, res) => {
    try {
      const { sourceLanguage, targetLanguage, text } = req.body;
      const data = await translationService.translateText(text, targetLanguage);
      res.status(200).json({ text: data });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = translationController;
