import { setContext } from 'svelte'
import type { Action } from 'svelte/action'
import type { Readable, Writable } from 'svelte/store'
import { derived, get, writable } from 'svelte/store'
import type { Suite } from 'vest'
import { vestContextKey, type UpdateField, type VestContext } from './context'

export { getVestContext, type VestContext } from './context'

export type GenericFormData = { [key: string]: string | number | boolean }

export type UseVestResult<T> = {
  action: Action<HTMLFormElement>
  error: Readable<string>
  submitting: Readable<boolean>
  disabled: Readable<boolean>
  reset: (data: T) => void
}

/// Converts a writable store to a readable.
const readableFrom = <T>(writable: Writable<T>): Readable<T> => ({
  subscribe: writable.subscribe,
})

type UseVestOptions<T extends GenericFormData> = {
  initialData: T
  /**
   * Invoked when the user submits the form. This is where you submit the data
   * to your server. If this function throws an exception, the exception is
   * caught, converted to a string with `convertError` and put into the `$error`
   * store.
   */
  submit: (data: T) => Promise<void>
  /**
   * When the submit function throws an error, this function converts the error
   * to a user presentable string.
   */
  convertError?: (e: unknown) => string
}

/**
 * Example usage:
 *
 *     const { action, error, disabled, reset } = useVest<FormData>(
 *       suite,
 *       { initial: 'data' },
 *       async (data) => {
 *         // Submit the data to your server
 *       }
 *   )
 */
export const useVest = <T extends GenericFormData>(
  suite: Suite<(data: T, currentField?: string | undefined) => void>,
  {
    initialData,
    submit,
    convertError = (e: unknown) => `${e}`,
  }: UseVestOptions<T>,
): UseVestResult<T> => {
  suite.reset()
  const error = writable('')
  const submitting = writable(false)
  const data = writable<T>({ ...initialData })
  for (const key of Object.keys(initialData)) {
    const value = initialData[key]
    if (value) {
      suite(initialData, key)
    }
  }
  const result = writable(suite.get())

  const disabled = derived([submitting, result], ([submitting, result]) => {
    return !result.isValid() || submitting
  })

  const reset = (newData: T) => {
    data.set(newData)
    suite.reset()
  }

  const updateField: UpdateField = (name, value) => {
    data.update((data) => ({ ...data, [name]: value }))
    const newData = get(data)
    result.set(suite(newData, name))
  }

  setContext<VestContext>(vestContextKey, {
    data,
    result,
    updateField,
    submitting,
  })

  const internalSubmit = async () => {
    if (get(submitting)) return
    error.set('')
    const submittedData = get(data)
    const result = suite(submittedData)
    if (result.hasErrors()) return

    try {
      submitting.set(true)
      await submit(submittedData)
    } catch (e) {
      console.error(e)
      error.set(convertError(e))
    } finally {
      submitting.set(false)
    }
  }
  const action = (node: HTMLFormElement) => {
    node.addEventListener('submit', (e) => {
      e.preventDefault()
      void internalSubmit()
    })
  }
  return {
    action,
    error: readableFrom(error),
    submitting: readableFrom(submitting),
    disabled,
    reset,
  }
}
