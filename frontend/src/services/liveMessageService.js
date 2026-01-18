import request from '../utils/http';

export const sendMessage = async (data) => {
  const res = await request.post('/message', data);
  return res;
};
