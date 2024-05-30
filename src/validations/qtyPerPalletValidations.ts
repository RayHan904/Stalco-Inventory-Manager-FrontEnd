
export const isNumeric = (value: string): boolean => /^\d*$/.test(value);

export const validateQtyPerPallet = (value: string): string | null => {
  if (!isNumeric(value)) {
    return 'Please enter only numbers.';
  }
  
  const numericValue = parseInt(value, 10);
  if (isNaN(numericValue) || numericValue >= 9999999) {
    return 'Enter a number less than 9999999.';
  }

  return null; 
};
