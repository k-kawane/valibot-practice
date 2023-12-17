import { z } from "zod"

export const ageVerification = z.object({
  age: z.coerce.number()
})

export type AgeVerification = z.infer<typeof ageVerification>