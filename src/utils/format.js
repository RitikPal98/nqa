export const nameFormat = (value= '') => 
    value.length > 3 
    ? value.substring(0,3).toUpperCase()
    : value.toUpperCase();
