import request from '../utils/http';

export const getFlights = async (page = 1, pageSize = 10) => {
  const res = await request.get(`/flight?page=${page}&limit=${pageSize}`);
  return res;
};

export const createFlight = async (data) => {
  const res = await request.post('/flight', data);
  return res;
};

export const updateFlight = async (data) => {
  const res = await request.put(`/flight/${data.id}`, data);
  return res;
};

export const deleteFlight = async (id) => {
  const res = await request.delete(`/flight/${id}`);
  return res;
};
