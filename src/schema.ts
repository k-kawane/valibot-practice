import { object, type Output, number, coerce, string } from 'valibot';

export const ageVerification = object({
  age: coerce(number(), (input) => Number(input))
})

export type AgeVerification = Output<typeof ageVerification>