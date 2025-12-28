import { Effect, Ref, pipe } from "effect"

export interface CounterState {
  count: number
  history: number[]
}

export const createCounter = (initialCount: number = 0) =>
  pipe(
    Ref.make<CounterState>({ count: initialCount, history: [initialCount] }),
    Effect.flatMap((ref) =>
      Effect.succeed({
        increment: () =>
          pipe(
            ref,
            Ref.update((state) => ({
              count: state.count + 1,
              history: [...state.history, state.count + 1]
            }))
          ),
        decrement: () =>
          pipe(
            ref,
            Ref.update((state) => ({
              count: state.count - 1,
              history: [...state.history, state.count - 1]
            }))
          ),
        get: () => Ref.get(ref),
        reset: () =>
          pipe(
            ref,
            Ref.set({ count: 0, history: [0] })
          )
      })
    )
  )

export const runStateManagement = async () => {
  console.log("\n=== State Management ===")
  
  const program = pipe(
    createCounter(0),
    Effect.flatMap((counter) =>
      pipe(
        counter.increment(),
        Effect.flatMap(() => counter.increment()),
        Effect.flatMap(() => counter.increment()),
        Effect.flatMap(() => counter.decrement()),
        Effect.flatMap(() => counter.get())
      )
    )
  )
  
  const state = await Effect.runPromise(program)
  console.log("Counter state:", state)
  
  const program2 = pipe(
    createCounter(10),
    Effect.flatMap((counter) =>
      pipe(
        counter.increment(),
        Effect.flatMap(() => counter.increment()),
        Effect.flatMap(() => counter.get())
      )
    )
  )
  
  const state2 = await Effect.runPromise(program2)
  console.log("Second counter state:", state2)
}

