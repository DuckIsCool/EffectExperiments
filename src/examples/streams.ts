import { Effect, Stream, pipe } from "effect"

export const runStreams = async () => {
  console.log("\n=== Streams ===")
  
  const numbers = Stream.range(1, 10)
  
  const doubled = pipe(
    numbers,
    Stream.map((n) => n * 2),
    Stream.take(5)
  )
  
  const result = await Effect.runPromise(
    Stream.runCollect(doubled)
  )
  console.log("First 5 doubled numbers:", Array.from(result))
  
  const sum = await Effect.runPromise(
    pipe(
      Stream.range(1, 5),
      Stream.runSum
    )
  )
  console.log("Sum of 1-5:", sum)
  
  const filtered = await Effect.runPromise(
    pipe(
      Stream.range(1, 10),
      Stream.filter((n) => n % 2 === 0),
      Stream.take(3),
      Stream.runCollect
    )
  )
  console.log("First 3 even numbers:", Array.from(filtered))
  
  const grouped = await Effect.runPromise(
    pipe(
      Stream.range(1, 10),
      Stream.grouped(3),
      Stream.take(2),
      Stream.runCollect
    )
  )
  console.log("First 2 groups of 3:", Array.from(grouped).map((group) => Array.from(group)))
}

