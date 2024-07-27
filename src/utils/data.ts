export function generateRandomInteger(lowerLimit: number, upperLimit: number) {
  const range = upperLimit - lowerLimit;
  return Math.floor(Math.random() * range) + lowerLimit;
}

type NonNullableObject<Type> = {
  [Key in keyof Type]: NonNullable<Type[Key]>;
};

export function pickDefinedProperties<Type extends Record<string, unknown>>(object: Type): NonNullableObject<Type> {
  const result = {} as NonNullableObject<Type>;

  for (const [key, value] of Object.entries(object)) {
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}
