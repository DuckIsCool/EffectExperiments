import { Effect, Runtime, Context, RuntimeFlags, FiberRefs, pipe } from "effect"

export const createCustomRuntime = () => {
  const runtime = Runtime.make({
    context: Context.empty(),
    runtimeFlags: RuntimeFlags.none,
    fiberRefs: FiberRefs.empty()
  })
  
  const program = pipe(
    Effect.succeed("Hello from custom runtime"),
    Effect.flatMap((message) =>
      Effect.sync(() => {
        console.log(message)
        return message.toUpperCase()
      })
    ),
    Effect.tap((result) => Effect.sync(() => console.log(`Result: ${result}`)))
  )
  
  return { runtime, program }
}

export const runWithRuntime = async () => {
  console.log("\n=== Runtime ===")
  
  const { runtime, program } = createCustomRuntime()
  
  const result = await Runtime.runPromise(runtime)(program)
  console.log("Final result:", result)
  
  const syncResult = Runtime.runSync(runtime)(
    Effect.succeed("Synchronous execution")
  )
  console.log("Sync result:", syncResult)
}

export const runWithFork = async () => {
  console.log("\n=== Runtime with Fork ===")
  
  const program = pipe(
    Effect.succeed("Task started"),
    Effect.tap((msg) => Effect.sync(() => console.log(msg))),
    Effect.delay("100 millis"),
    Effect.flatMap(() => Effect.succeed("Task completed"))
  )
  
  const runtime = Runtime.make({
    context: Context.empty(),
    runtimeFlags: RuntimeFlags.none,
    fiberRefs: FiberRefs.empty()
  })
  const fiber = Runtime.runFork(runtime)(program)
  
  await Runtime.runPromise(runtime)(fiber.await)
  console.log("Forked task finished")
}

