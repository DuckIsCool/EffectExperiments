import { Effect, pipe } from "effect"

export class ValidationError extends Error {
  readonly _tag = "ValidationError"
  constructor(message: string) {
    super(message)
  }
}

export class NetworkError extends Error {
  readonly _tag = "NetworkError"
  constructor(message: string) {
    super(message)
  }
}

export class DatabaseError extends Error {
  readonly _tag = "DatabaseError"
  constructor(message: string) {
    super(message)
  }
}

export const validateEmail = (email: string): Effect.Effect<string, ValidationError> =>
  email.includes("@")
    ? Effect.succeed(email)
    : Effect.fail(new ValidationError("Invalid email format"))

export const fetchUserData = (userId: number): Effect.Effect<{ id: number; name: string }, NetworkError> =>
  userId > 0
    ? Effect.succeed({ id: userId, name: `User ${userId}` })
    : Effect.fail(new NetworkError("Failed to fetch user data"))

export const saveToDatabase = (data: { id: number; name: string }): Effect.Effect<void, DatabaseError> =>
  data.id > 0
    ? Effect.succeed(undefined)
    : Effect.fail(new DatabaseError("Failed to save to database"))

export const processUser = (email: string, userId: number) =>
  pipe(
    validateEmail(email),
    Effect.flatMap(() => fetchUserData(userId)),
    Effect.flatMap(saveToDatabase),
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
  
  const result1 = await Effect.runPromise(processUser("test@fed.osaka", 1))
  console.log("Success case:", result1)
  
  const result2 = await Effect.runPromise(processUser("invalid-email", 1))
  console.log("Validation error:", result2)
  
  const result3 = await Effect.runPromise(processUser("test@fed.osaka", -1))
  console.log("Network error:", result3)
}

