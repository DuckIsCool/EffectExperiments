import { Schema, Effect, pipe } from "effect"

export const UserSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  email: Schema.String,
  age: Schema.optional(Schema.Number),
  active: Schema.Boolean
})

export type User = Schema.Schema.Type<typeof UserSchema>

export const validateUser = (data: unknown): Effect.Effect<User, Error> =>
  pipe(
    Schema.decodeUnknown(UserSchema)(data),
    Effect.mapError((error) => new Error(`Validation failed: ${JSON.stringify(error)}`))
  )

export const createUser = (data: Partial<User>): Effect.Effect<User, Error> =>
  pipe(
    Schema.decodeUnknown(UserSchema)({
      id: data.id ?? 0,
      name: data.name ?? "",
      email: data.email ?? "",
      age: data.age,
      active: data.active ?? true
    }),
    Effect.mapError((error) => new Error(`Creation failed: ${JSON.stringify(error)}`))
  )

export const runSchema = async () => {
  console.log("\n=== Schema ===")
  
  const validData = {
    id: 1,
    name: "johnpork",
    email: "porkquave@gmail.com",
    age: 111,
    active: true
  }
  
  const result1 = await Effect.runPromise(validateUser(validData))
  console.log("Valid user:", result1)
  
  const invalidData = {
    id: "notnumbertest",
    name: "rio",
    email: "rio@gmail.com"
  }
  
  try {
    await Effect.runPromise(validateUser(invalidData))
  } catch (error) {
    console.log("Validation error (expected):", (error as Error).message)
  }
  
  const partialData = {
    id: 2,
    name: "Test+Partial",
    email: "tes@gmail.com"
  }
  
  const result2 = await Effect.runPromise(createUser(partialData))
  console.log("Created user:", result2)
}

