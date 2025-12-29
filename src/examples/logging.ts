import { Effect, Logger, LogLevel } from "effect"

export const runLogging = async () => {
  console.log("\n=== Logging ===")
  
  const program = Effect.gen(function* () {
    yield* Effect.log("Starting operation")
    
    yield* Effect.logInfo("Processing data")
    
    yield* Effect.logWarning("This is a warning")
    
    yield* Effect.logError("This is an error")
    
    yield* Effect.log("Operation completed")
    
    return "Success"
  })
  
  const result = await Effect.runPromise(
    program.pipe(
      Logger.withMinimumLogLevel(LogLevel.Info)
    )
  )
  console.log("Program result:", result)
  
  const structuredLog = Effect.gen(function* () {
    yield* Effect.log("User action", {
      userId: 123,
      action: "login",
      timestamp: new Date().toISOString()
    })
    
    return "Logged"
  })
  
  await Effect.runPromise(structuredLog)
  
  const annotatedLog = Effect.gen(function* () {
    yield* Effect.log("Step 1", { service: "example-service", version: "1.0.0" })
    yield* Effect.log("Step 2", { service: "example-service", version: "1.0.0" })
    yield* Effect.log("Step 3", { service: "example-service", version: "1.0.0" })
    
    return "Done"
  })
  
  await Effect.runPromise(annotatedLog)
}

