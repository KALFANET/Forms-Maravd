export const validateIsraeliID = (id) => {
  id = id.replace(/\D/g, '');
  if (id.length !== 9) return false;
  ... (remaining idValidation code)
};