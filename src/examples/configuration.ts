import { Effect, Config, ConfigProvider, pipe } from "effect"

export const appConfig = Config.all({
  port: Config.integer("PORT").pipe(Config.withDefault(3000)),
  host: Config.string("HOST").pipe(Config.withDefault("localhost")),
  apiKey: Config.string("API_KEY"),
  debug: Config.boolean("DEBUG").pipe(Config.withDefault(false)),
  timeout: Config.integer("TIMEOUT").pipe(Config.withDefault(5000))
})

export const getAppConfig = () =>
  pipe(
    appConfig,
    Effect.flatMap((config) =>
      Effect.sync(() => {
        console.log("Application Configuration:")
        console.log(`  Port: ${config.port}`)
        console.log(`  Host: ${config.host}`)
        console.log(`  API Key: ${config.apiKey}...`)
        console.log(`  Debug: ${config.debug}`)
        console.log(`  Timeout: ${config.timeout}ms`)
        return config
      })
    )
  )

export const runConfiguration = async () => {
  console.log("\n=== Configuration ===")
  
  const configProvider = ConfigProvider.fromMap(
    new Map([
      ["PORT", "8080"],
      ["HOST", "0.0.0.0"],
      ["API_KEY", "fjahhdjfsljldfhs"],
      ["DEBUG", "true"],
      ["TIMEOUT", "10000"]
    ])
  )
  
  const result = await Effect.runPromise(
    Effect.withConfigProvider(configProvider)(getAppConfig())
  )
  
  return result
}

