import request, { generalRequest } from '../utils/http';

export const loginAdmin = async (data) => {
  const res = await generalRequest.post('/admin/login', data);
  return res;
};

export const getAdmin = async () => {
  const res = await request.get('/admin');
  return res;
};

export const createAdmin = async (data) => {
  const res = await request.post('/admin', data);
  return res;
};

export const logoutAdmin = async () => {
  const res = await request.post('/admin/logout');
  return res;
};
