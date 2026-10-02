import { apiFetch } from '../utils/api';

export const initiateEsewaPayment = async (eventId) => {
  return apiFetch('/api/payments/esewa/initiate', {
    method: 'POST',
    body: JSON.stringify({ event_id: eventId })
  });
};

export const submitEsewaForm = (esewaUrl, formData) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = esewaUrl;
  form.style.display = 'none';

  Object.entries(formData).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

export const verifyEsewaPayment = async (data) => {
  return apiFetch('/api/payments/esewa/verify', {
    method: 'POST',
    body: JSON.stringify({ data })
  });
};

export const getUserPayments = async (userId) => {
  return apiFetch(`/api/payments/user/${userId}`);
};
