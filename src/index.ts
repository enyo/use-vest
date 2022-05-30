import { getContext, setContext } from 'svelte'
import type { Action } from 'svelte/action'
import type { Readable, Writable } from 'svelte/store'
import { derived, get, writable } from 'svelte/store'
import type { Suite, SuiteResult } from 'vest'

const vestContextKey = {}

export type VestContext = {
  data: Readable<GenericFormData>
  updateField: UpdateField
  result: Readable<SuiteResult>
  disabled: Readable<boolean>
}

export const getVestContext = (): VestContext => getContext(vestContextKey)

export type UpdateField = (
  name: string,
  value: string | number | boolean,
) => void

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
  initialData: T,
  submit: (data: T) => Promise<void>,
  { convertError = (e: unknown) => `${e}` } = {},
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
    disabled,
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
