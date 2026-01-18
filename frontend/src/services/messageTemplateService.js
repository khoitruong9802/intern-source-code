import request from '../utils/http';

export const getMessageTemplate = async () => {
  const res = await request.get('/message-template/all');
  return res;
};

export const createMessageTemplate = async (data) => {
  const res = await request.post('/message-template', data);
  return res;
};

export const deleteMessageTemplate = async (id) => {
  const res = await request.delete(`/message-template/${id}`);
  return res;
};

export const deleteAllMessageTemplate = async (id) => {
  const res = await request.delete('/message-template');
  return res;
};
