import request from '../utils/http';

export const getAllAirports = async () => {
  const res = await request.get(`/airport/all`);
  return res;
};

export const getAirports = async (page = 1, pageSize = 10) => {
  const res = await request.get(`/airport?page=${page}&limit=${pageSize}`);
  return res;
};

export const createAirport = async (data) => {
  const res = await request.post('/airport', data);
  return res;
};

export const updateAirport = async (data) => {
  const res = await request.put(`/airport/${data.id}`, data);
  return res;
};

export const deleteAirport = async (id) => {
  const res = await request.delete(`/airport/${id}`);
  return res;
};
