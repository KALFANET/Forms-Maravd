export const validateIsraeliPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (!/^05\d{8}$/.test(cleaned)) {
    return false;
  }
  return true;
};