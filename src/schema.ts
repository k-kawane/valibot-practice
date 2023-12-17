import { z } from "zod"

// export const ageVerification = z.object({
//   age: z.coerce.number()
// })
export const ageVerification = z.object({
  age: z.string()
}).transform((values)=> {
  return {
    age: Number(values.age)
  }
})

export type AgeVerification = z.infer<typeof ageVerification>