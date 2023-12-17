import { object, type Output, string, transform } from 'valibot';

export const ageVerification = transform(
  object({
    age: string()
  }),
  (input) => {
    return {
      age: Number(input.age)
    }
  }
)

export type AgeVerification = Output<typeof ageVerification>