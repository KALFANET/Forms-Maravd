export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 10)}`;
  }
  return phone;
};

export const formatIdNumber = (id) => {
  const cleaned = id.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 8)}-${cleaned.slice(8)}`;
  }
  return id;
};