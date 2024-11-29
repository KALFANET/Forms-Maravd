export const validateIsraeliID = (id) => {
  id = id.replace(/\D/g, '');
  if (id.length !== 9) return false;
  
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    let digit = parseInt(id[i]);
    if (i % 2 === 0) digit *= 1;
    else digit *= 2;
    if (digit > 9) digit -= 9;
    sum += digit;
  }
  return sum % 10 === 0;
};