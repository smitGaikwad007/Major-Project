const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const connectionError = new Error('Unable to connect to the Philately API server. Please ensure the backend is running.');
      connectionError.status = 503;
      throw connectionError;
    }
    throw error;
  }
}

export const stampApi = {
  getAll: () => request('/stamps'),
  getById: (id) => request(`/stamps/${id}`),
  create: (stampData) =>
    request('/stamps', {
      method: 'POST',
      body: JSON.stringify(stampData),
    }),
  delete: (id) =>
    request(`/stamps/${id}`, {
      method: 'DELETE',
    }),
};

export const collectionApi = {
  getAll: () => request('/collection'),
  add: (itemData) =>
    request('/collection', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),
  remove: (id) =>
    request(`/collection/${id}`, {
      method: 'DELETE',
    }),
};

export const pdaApi = {
  getAccounts: () => request('/pda/accounts'),
  openAccount: (accountData) =>
    request('/pda/open', {
      method: 'POST',
      body: JSON.stringify(accountData),
    }),
  verifySerial: (serialNumber) =>
    request('/pda/verify', {
      method: 'POST',
      body: JSON.stringify({ serialNumber }),
    }),
};

export const verificationApi = {
  checkStamp: (serial) =>
    request('/verification/check-stamp', {
      method: 'POST',
      body: JSON.stringify({ serial }),
    }),
  fairDrop: (payload) =>
    request('/verification/fair-drop', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getAllocations: () => request('/verification/allocations'),
};

export const healthApi = {
  check: () => request('/health'),
};

export default {
  stamps: stampApi,
  collection: collectionApi,
  pda: pdaApi,
  verification: verificationApi,
  health: healthApi,
};
