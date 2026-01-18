import request from '../utils/http';

export const getSettings = async () => {
  const res = await request.get('/setting');
  return res;
};

// export const createSetting = async (data) => {
//   const res = await request.post('/setting', data);
//   return res;
// };

export const updateSetting = async (data) => {
  const res = await request.put(`/setting/${data.id}`, data);
  return res;
};

export const deleteSetting = async (id) => {
  const res = await request.delete(`/setting/${id}`);
  return res;
};
