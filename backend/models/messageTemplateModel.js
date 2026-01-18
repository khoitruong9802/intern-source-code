const pool = require('../config/database');

const airlineModel = {
  getAllMessageTemplates: async () => {
    const result = await pool.query('SELECT * FROM message_template');
    return result.rows;
  },

  createMessageTemplate: async (
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
  ) => {
    const result = await pool.query(
      'INSERT INTO message_template (message, message_length, translated_message, font_family, is_bold, is_italic, is_underlined, font_size, color, background_color, effect, stop_over, translated_mes_before) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [
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
      ]
    );
    return result.rows[0];
  },

  updateMessageTemplate: async (
    id,
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
  ) => {
    const result = await pool.query(
      'UPDATE message_template SET message = $1, message_length = $2, translated_message = $3, font_family = $4, is_bold = $5, is_italic = $6, is_underlined = $7, font_size = $8, color = $9, background_color = $10, effect = $11, stop_over = $12, translated_mes_before = $13 WHERE id = $14 RETURNING *',
      [
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
        id,
      ]
    );
    return result.rows[0];
  },

  deleteMessageTemplate: async (id) => {
    const result = await pool.query(
      'DELETE FROM message_template WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  deleteAllMessageTemplate: async (id) => {
    const result = await pool.query('DELETE FROM message_template RETURNING *');
    console.log(result);
    return result.rows;
  },
};

module.exports = airlineModel;
