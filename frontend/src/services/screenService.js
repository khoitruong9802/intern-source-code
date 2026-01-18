import request from '../utils/http';

export const getScreens = async (page = 1, pageSize = 10) => {
  const res = await request.get(`/screen?page=${page}&limit=${pageSize}`);
  return res;
};

export const getAllScreens = async () => {
  const res = await request.get('/screen/all');
  return res;
};

export const createScreen = async (data) => {
  const res = await request.post('/screen', data);
  return res;
};

export const updateScreen = async (data) => {
  const res = await request.put(`/screen/${data.id}`, data);
  return res;
};

export const deleteScreen = async (id) => {
  const res = await request.delete(`/screen/${id}`);
  return res;
};

export const controlScreen = async (data) => {
  const res = await request.post(`/screen/control`, data);
  return res;
};
