export const measurePing = async (url = 'https://www.google.com/generate_204'): Promise<number> => {
  const start = Date.now();
  try {
    await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
      mode: 'no-cors'
    });
    return Date.now() - start;
  } catch (error) {
    console.warn('Ping failed', error);
    return -1;
  }
};
