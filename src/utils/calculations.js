export const heightToMeters = (ft, inches) => {
  const totalInches = ft * 12 + inches;
  return totalInches * 0.0254; // Convert to meters
};
