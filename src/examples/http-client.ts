import { Effect } from "effect"
import { HttpClient } from "@effect/platform"
import { NodeHttpClient } from "@effect/platform-node"

export const fetchUser = (userId: number) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient
    const response = yield* client.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
    return yield* response.json
  }).pipe(Effect.scoped, Effect.provide(NodeHttpClient.layer))

export const fetchMultipleUsers = (userIds: number[]) =>
  Effect.all(
    userIds.map((id) => fetchUser(id)),
    { concurrency: 3 }
  )

export const runHttpClient = async () => {
  console.log("\n=== HttpClient ===")
  
  try {
    const user = await Effect.runPromise(fetchUser(1))
    console.log("Fetched user:", JSON.stringify(user, null, 2))
    
    const users = await Effect.runPromise(fetchMultipleUsers([1, 2, 3]))
    console.log(`Fetched ${users.length} users concurrently`)
    console.log("User names:", users.map((u: any) => u.name))
    
  } catch (error) {
    console.log("HTTP request error:", (error as Error).message)
  }
}

