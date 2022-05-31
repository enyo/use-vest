import type { GenericFormData } from '.'
import { getContext } from 'svelte'
import type { Readable } from 'svelte/store'
import type { SuiteResult } from 'vest'

export const vestContextKey: unknown = {}

export type VestContext = {
  data: Readable<GenericFormData>
  updateField: UpdateField
  result: Readable<SuiteResult>
  submitting: Readable<boolean>
}

export const getVestContext = (): VestContext => getContext(vestContextKey)

export type UpdateField = (
  name: string,
  value: string | number | boolean,
) => void
