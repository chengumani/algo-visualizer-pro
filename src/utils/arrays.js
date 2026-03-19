export const generateRandomArray = (size) => {
  const clamped = Math.max(5, Math.min(200, size));
  return Array.from({ length: clamped }, () => Math.floor(Math.random() * 95) + 5);
};
