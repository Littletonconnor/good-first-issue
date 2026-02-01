/**
 * Result type for explicit error handling
 *
 * Instead of throwing exceptions, functions return Result<T, E> which forces
 * callers to explicitly handle both success and failure cases.
 *
 * @example
 * ```typescript
 *   const result = await fetchUser(id)
 *   if (!result.ok) {
 *     console.error('Failed:', result.error.message)
 *     return
 *   }
 *
 *   console.log(result.value.name)
 * ```
 */

export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }

/**
 * Create a successful Result.
 *
 * @example
 * ```typescript
 *  return ok({id: 1, name: 'Alice'})
 * ```
 */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

/**
 * Create a failed result.
 *
 * @example
 * ```typescript
 *  return err(new Error('User not found'))
 * ```
 */
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

/**
 * Unwrap a Result, throwing if it's an error.
 *
 * @example
 * ```typescript
 *  const user = unwrap(await fetchUser(id)) // throws if error
 * ```
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value
  }

  throw result.error
}

/**
 * Unwrap a Result with a default value for errors
 *
 * @example
 * ```typescript
 * const count = unwrapOr(await fetchCount(), 0)
 * ```
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (result.ok) {
    return result.value
  }

  return defaultValue
}

/**
 * Map over a successful Result's value.
 * If the Result is an error, return the error unchanged.
 *
 * @example
 * ```typescript
 * const nameResult = map(userResult, user => user.name)
 * ```
 */
export function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  if (result.ok) {
    return ok(fn(result.value))
  }

  return result
}

/**
 * Chain Results together. If the first Result is an error, short-circuit.
 * Otherwise, apply the function which returns the new result.
 *
 * @example
 * ```typescript
 * const profileResult = flatMap(userResult, user => fetchProfile(user.id))
 * ```
 */
export function flatMap<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  if (result.ok) {
    return fn(result.value)
  }
  return result
}

/**
 * Wrap a promise that might reject into a result
 * Catches any thrown errors and converts them to Result.
 *
 * @example
 * ```typescript
 * const result = await fromPromise(fetch(url).then(r => r.json()))
 * ```
 */
export async function fromPromise<T>(promise: Promise<T>): Promise<Result<T, Error>> {
  try {
    const value = await promise
    return ok(value)
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)))
  }
}

/**
 * Check if a result is successful
 */
export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok
}

/**
 * Check if a result is an error
 */
export function isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return !result.ok
}
