import { runErrorManagement } from "./examples/error-management.js"
import { runRequirementsManagement } from "./examples/requirements-management.js"
import { runResourceManagement } from "./examples/resource-management.js"
import { runConfiguration } from "./examples/configuration.js"
import { runWithRuntime, runWithFork } from "./examples/runtime.js"
import { runStateManagement } from "./examples/state-management.js"
import { runSchema } from "./examples/schema.js"
import { runHttpClient } from "./examples/http-client.js"
import { runStreams } from "./examples/streams.js"
import { runScheduleRetry } from "./examples/schedule-retry.js"
import { runLogging } from "./examples/logging.js"
import { runQueueChannel } from "./examples/queue-channel.js"

const main = async () => {
  console.log("EffectTesting")
  console.log("=".repeat(50))
  
  await runErrorManagement()
  await runRequirementsManagement()
  await runResourceManagement()
  await runConfiguration()
  await runWithRuntime()
  await runWithFork()
  await runStateManagement()
  await runSchema()
  await runHttpClient()
  await runStreams()
  await runScheduleRetry()
  await runLogging()
  await runQueueChannel()
  
  console.log("\n" + "=".repeat(50))
  console.log("All examples completed!")
}

main().catch(console.error)

