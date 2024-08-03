export function generateRandomInteger(lowerLimit: number, upperLimit: number) {
  const range = upperLimit - lowerLimit;
  return Math.floor(Math.random() * range) + lowerLimit;
}
