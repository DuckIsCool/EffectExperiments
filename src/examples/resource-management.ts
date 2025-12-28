import { Effect, pipe } from "effect"

export class FileHandle {
  constructor(public readonly path: string) {}
  
  close(): void {
    console.log(`Closing file: ${this.path}`)
  }
}

export const openFile = (path: string): Effect.Effect<FileHandle, Error> =>
  Effect.sync(() => {
    console.log(`Opening file: ${path}`)
    return new FileHandle(path)
  })

export const readFile = (handle: FileHandle): Effect.Effect<string, Error> =>
  Effect.sync(() => {
    console.log(`Reading from file: ${handle.path}`)
    return `Content from ${handle.path}`
  })

export const writeFile = (handle: FileHandle, content: string): Effect.Effect<void, Error> =>
  Effect.sync(() => {
    console.log(`Writing to file: ${handle.path}: ${content}`)
  })

export const processFile = (path: string) =>
  pipe(
    openFile(path),
    Effect.flatMap((handle) =>
      pipe(
        readFile(handle),
        Effect.flatMap((content) =>
          pipe(
            writeFile(handle, `Modified: ${content}`),
            Effect.map(() => `Successfully processed file: ${path}`)
          )
        ),
        Effect.ensuring(Effect.sync(() => handle.close()))
      )
    )
  )

export const runResourceManagement = async () => {
  console.log("\n=== Resource Management ===")
  
  const result = await Effect.runPromise(
    processFile("/tmp/example.txt")
  )
  console.log("File processing completed:", result)
}

