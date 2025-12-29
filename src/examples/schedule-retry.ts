import { Effect, Schedule, pipe } from "effect"

const flakyOperation = (attempt: number): Effect.Effect<string, Error> =>
  attempt < 3
    ? Effect.fail(new Error(`Failed on attempt ${attempt}`))
    : Effect.succeed(`Success on attempt ${attempt}`)

export const runScheduleRetry = async () => {
  console.log("\n=== Schedule & Retry ===")
  
  const retrySchedule = Schedule.exponential("100 millis").pipe(
    Schedule.union(Schedule.recurs(5))
  )
  
  const result = await Effect.runPromise(
    pipe(
      Effect.gen(function* () {
        const attempt = yield* Effect.sync(() => Math.floor(Math.random() * 5) + 1)
        return yield* flakyOperation(attempt)
      }),
      Effect.retry(retrySchedule),
      Effect.catchAll((error) => Effect.succeed(`Failed after retries: ${error.message}`))
    )
  )
  console.log("Retry result:", result)
  
  const fixedDelaySchedule = Schedule.fixed("200 millis").pipe(
    Schedule.compose(Schedule.recurs(3))
  )
  
  const delayedResult = await Effect.runPromise(
    pipe(
      Effect.succeed("Operation completed"),
      Effect.delay("100 millis"),
      Effect.repeat(fixedDelaySchedule)
    )
  )
  console.log("Repeated operation:", delayedResult)
  
  const timeoutResult = await Effect.runPromise(
    pipe(
      Effect.gen(function* () {
        yield* Effect.sleep("2 seconds")
        return "Slow operation"
      }),
      Effect.timeout("500 millis"),
      Effect.catchAll(() => Effect.succeed("Operation timed out"))
    )
  )
  console.log("Timeout result:", timeoutResult)
}

