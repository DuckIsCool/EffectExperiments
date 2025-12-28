import { Effect, pipe, Data } from "effect"

export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string
}> {}

export class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly message: string
}> {}

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  readonly message: string
}> {}

export const validateEmail = (email: string): Effect.Effect<string, ValidationError> =>
  email.includes("@")
    ? Effect.succeed(email)
    : Effect.fail(new ValidationError({ message: "Invalid email format" }))

export const fetchUserData = (userId: number): Effect.Effect<{ id: number; name: string }, NetworkError> =>
  userId > 0
    ? Effect.succeed({ id: userId, name: `User ${userId}` })
    : Effect.fail(new NetworkError({ message: "Failed to fetch user data" }))

export const saveToDatabase = (data: { id: number; name: string }): Effect.Effect<void, DatabaseError> =>
  data.id > 0
    ? Effect.succeed(undefined)
    : Effect.fail(new DatabaseError({ message: "Failed to save to database" }))

export const processUser = (email: string, userId: number) =>
  pipe(
    validateEmail(email),
    Effect.flatMap(() => fetchUserData(userId)),
    Effect.flatMap((userData) =>
      pipe(
        saveToDatabase(userData),
        Effect.map(() => `Successfully processed user: ${userData.name}`)
      )
    ),
    Effect.catchAll((error) => {
      if (error._tag === "ValidationError") {
        return Effect.succeed(`Validation failed: ${error.message}`)
      }
      if (error._tag === "NetworkError") {
        return Effect.succeed(`Network error: ${error.message}`)
      }
      return Effect.succeed(`Database error: ${error.message}`)
    })
  )

export const runErrorManagement = async () => {
  console.log("\n=== Error Management ===")
  
  const result1 = await Effect.runPromise(processUser("test@gmail.com", 1))
  console.log("Success case:", result1)
  
  const result2 = await Effect.runPromise(processUser("invalid-email", 1))
  console.log("Validation error:", result2)
  
  const result3 = await Effect.runPromise(processUser("test@gmail.com", -1))
  console.log("Network error:", result3)
}

