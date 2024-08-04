export const generarReference = (longitud) => {
    return Array.from({ length: longitud }, () => Math.floor(Math.random() * 10)).join('');
  };