const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

// Your credentials
const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Configuration for the client
const translate = new Translate({
  credentials: GOOGLE_CREDENTIALS,
  projectId: GOOGLE_CREDENTIALS.project_id,
});

const translationService = {
  detectLanguage: async (text) => {
    try {
      let response = await translate.detect(text);
      return response[0].language;
    } catch (error) {
      console.log(`Error at detectLanguage --> ${error}`);
      return 0;
    }
  },

  // detectLanguage('Oggi è lunedì')
  //     .then((res) => {
  //         console.log(res);
  //     })
  //     .catch((err) => {
  //         console.log(err);
  //     });

  translateText: async (text, targetLanguage) => {
    try {
      let [response] = await translate.translate(text, targetLanguage);
      return response;
    } catch (error) {
      console.log(`Error at translateText --> ${error}`);
      return 0;
    }
  },
};

module.exports = translationService;
