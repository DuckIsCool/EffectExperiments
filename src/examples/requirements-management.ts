import { Effect, Context, Layer, pipe } from "effect"

export interface DatabaseService {
  readonly query: (sql: string) => Effect.Effect<string[], Error>
}

export const DatabaseService = Context.GenericTag<DatabaseService>("DatabaseService")

export const DatabaseServiceLive = Layer.succeed(
  DatabaseService,
  DatabaseService.of({
    query: (sql: string) =>
      Effect.succeed([`Result 1 for: ${sql}`, `Result 2 for: ${sql}`])
  })
)

export interface LoggerService {
  readonly log: (message: string) => Effect.Effect<void>
}

export const LoggerService = Context.GenericTag<LoggerService>("LoggerService")

export const LoggerServiceLive = Layer.succeed(
  LoggerService,
  LoggerService.of({
    log: (message: string) => Effect.sync(() => console.log(`[LOG] ${message}`))
  })
)

export const getUserById = (id: number) =>
  pipe(
    Effect.gen(function* () {
      const db = yield* DatabaseService
      const logger = yield* LoggerService
      
      yield* logger.log(`Fetching user ${id}`)
      const results = yield* db.query(`SELECT * FROM users WHERE id = ${id}`)
      yield* logger.log(`Found ${results.length} results`)
      
      return results
    })
  )

export const runRequirementsManagement = async () => {
  console.log("\n=== Requirements Management ===")
  
  const program = getUserById(42)
  const layer = Layer.merge(DatabaseServiceLive, LoggerServiceLive)
  
  const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
  console.log("Query results:", result)
}

