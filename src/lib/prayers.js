import { get, post, del } from './api';

export const listCurated = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return get(`/browse/prayers${qs ? `?${qs}` : ''}`);
};

export const getCurated = (id) => get(`/browse/prayers/${id}`);

export const listSaved = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return get(`/saved-prayers${qs ? `?${qs}` : ''}`);
};

export const savePrayer = (id) => post(`/saved-prayers/${id}`, {});
export const unsavePrayer = (id) => del(`/saved-prayers/${id}`);
