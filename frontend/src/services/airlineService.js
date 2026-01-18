import request from '../utils/http';

export const getAllAirlines = async () => {
  const res = await request.get(`/airline/all`);
  return res;
};

export const getAllAirlinesImg = async () => {
  const res = await request.get(`/airline/all?img`);
  return res;
};

export const getAirlines = async (page = 1, pageSize = 10) => {
  const res = await request.get(`/airline?page=${page}&limit=${pageSize}`);
  return res;
};

export const createAirline = async (data) => {
  const res = await request.post('/airline', data);
  return res;
};

export const updateAirline = async (data) => {
  const res = await request.put(`/airline/${data.id}`, data);
  return res;
};

export const deleteAirline = async (id) => {
  const res = await request.delete(`/airline/${id}`);
  return res;
};
