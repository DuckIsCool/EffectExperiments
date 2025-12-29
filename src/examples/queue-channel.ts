import { Effect, Queue, pipe } from "effect"

export const runQueueChannel = async () => {
  console.log("\n=== Queue & Channel ===")
  
  const program = Effect.gen(function* () {
    const queue = yield* Queue.bounded<string>(10)
    
    yield* Queue.offer(queue, "Message 1")
    yield* Queue.offer(queue, "Message 2")
    yield* Queue.offer(queue, "Message 3")
    
    const msg1 = yield* Queue.take(queue)
    const msg2 = yield* Queue.take(queue)
    const msg3 = yield* Queue.take(queue)
    
    return [msg1, msg2, msg3]
  })
  
  const messages = await Effect.runPromise(program)
  console.log("Queue messages:", messages)
  
  const producerConsumer = Effect.gen(function* () {
    const queue = yield* Queue.unbounded<number>()
    
    const producer = Effect.gen(function* () {
      for (let i = 1; i <= 5; i++) {
        yield* Queue.offer(queue, i)
        yield* Effect.log(`Produced: ${i}`)
        yield* Effect.sleep("100 millis")
      }
    })
    
    const consumer = Effect.gen(function* () {
      const results: number[] = []
      for (let i = 0; i < 5; i++) {
        const value = yield* Queue.take(queue)
        results.push(value)
        yield* Effect.log(`Consumed: ${value}`)
      }
      return results
    })
    
    yield* Effect.fork(producer)
    const consumed = yield* consumer
    
    return consumed
  })
  
  const consumed = await Effect.runPromise(producerConsumer)
  console.log("Consumed values:", consumed)
  
  const queueSize = Effect.gen(function* () {
    const queue = yield* Queue.bounded<string>(5)
    
    yield* Queue.offer(queue, "A")
    yield* Queue.offer(queue, "B")
    
    const size = yield* Queue.size(queue)
    return size
  })
  
  const size = await Effect.runPromise(queueSize)
  console.log("Queue size:", size)
}

