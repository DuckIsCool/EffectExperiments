import { runErrorManagement } from "./examples/error-management.js"
import { runRequirementsManagement } from "./examples/requirements-management.js"
import { runResourceManagement } from "./examples/resource-management.js"
import { runConfiguration } from "./examples/configuration.js"
import { runWithRuntime, runWithFork } from "./examples/runtime.js"
import { runStateManagement } from "./examples/state-management.js"
import { runSchema } from "./examples/schema.js"
import { runHttpClient } from "./examples/http-client.js"

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
  
  console.log("\n" + "=".repeat(50))
  console.log("All examples completed!")
}

main().catch(console.error)

