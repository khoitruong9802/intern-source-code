const translationService = require('../../services/translationService');
const translationController = require('../../controllers/translationController'); // Adjust the path as needed

jest.mock('../../services/translationService'); // Mock the translationService

describe('Translation Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        sourceLanguage: 'en',
        targetLanguage: 'es',
        text: 'Hello',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should translate text and return 200', async () => {
    // Arrange
    const translatedText = 'Hola';
    translationService.translateText.mockResolvedValue(translatedText);

    // Act
    await translationController.translateText(req, res);

    // Assert
    expect(translationService.translateText).toHaveBeenCalledWith(
      req.body.text,
      req.body.targetLanguage
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: translatedText });
  });

  test('should handle errors and return 500', async () => {
    // Arrange
    translationService.translateText.mockRejectedValue(
      new Error('Translation error')
    );

    // Act
    await translationController.translateText(req, res);
    expect(translationService.translateText).toHaveBeenCalledWith(
      req.body.text,
      req.body.targetLanguage
    );

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});
