import request from '../utils/http';

export const getTranslatedText = async (data) => {
  const res = await request.post('/translation', data);
  return res;
};
