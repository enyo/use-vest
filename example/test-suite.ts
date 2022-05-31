import { create, enforce, only, test } from 'vest'

export type FormData = {
  email: string
  firstName: string
  lastName: string
}

export const initialData: FormData = { email: '', firstName: '', lastName: '' }

// Very default Vest suite. If that looks foreign to you, then look
// up the vest docs.
export const suite = create((data: FormData, currentField) => {
  // If field name is supplied validate only that field
  only(currentField)

  test('email', 'Email is required', () => {
    enforce(data.email).isNotBlank()
  })
  test('email', 'Email must contain @ sign', () => {
    enforce(data.email).matches(/@/)
  })

  test('firstName', 'First name is required', () => {
    enforce(data.firstName).isNotBlank()
  })
  test('firstName', 'First name must be at least 3 characters', () => {
    enforce(data.firstName).longerThan(2)
  })

  test('lastName', 'Last name is required', () => {
    enforce(data.lastName).isNotBlank()
  })
  test('lastName', 'Last name must be at least 3 characters', () => {
    enforce(data.lastName).longerThan(2)
  })
})
