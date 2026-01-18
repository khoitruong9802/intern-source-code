import { generalRequest } from '../utils/http';

export const checkIsAuth = async () => {
  const res = await generalRequest.post('/admin/logged', {});
  return res;
};
