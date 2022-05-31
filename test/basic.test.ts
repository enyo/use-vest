import { render } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import Form from '../example/Form.svelte'

test('submit button is disabled until form data is valid', async () => {
  const { getByText, getByRole, getByPlaceholderText } = render(Form)

  expect(getByRole('heading', { level: 1 }).innerHTML).toEqual('Register')
  expect(getByText('Register')).toBeTruthy()
  expect(getByRole('button').hasAttribute('disabled')).toBeTruthy()

  await userEvent.type(getByPlaceholderText('email'), 'e@mail.com')
  await userEvent.type(getByPlaceholderText('firstName'), 'John')
  await userEvent.type(getByPlaceholderText('lastName'), 'Doe')

  expect(getByRole('button').hasAttribute('disabled')).toBeFalsy()
})

test('shows individual errors for each field', async () => {
  const { getByPlaceholderText, getByTestId } = render(Form)

  expect(getByTestId('error-email').innerHTML).toBeFalsy()
  expect(getByTestId('error-firstName').innerHTML).toBeFalsy()
  expect(getByTestId('error-lastName').innerHTML).toBeFalsy()

  await userEvent.type(getByPlaceholderText('email'), 'email.com')
  await userEvent.type(getByPlaceholderText('firstName'), 'Jo')
  await userEvent.type(getByPlaceholderText('lastName'), 'Do')

  expect(getByTestId('error-email').innerHTML).toEqual(
    'Email must contain @ sign',
  )
  expect(getByTestId('error-firstName').innerHTML).toEqual(
    'First name must be at least 3 characters',
  )
  expect(getByTestId('error-lastName').innerHTML).toEqual(
    'Last name must be at least 3 characters',
  )

  await userEvent.clear(getByPlaceholderText('email'))
  await userEvent.clear(getByPlaceholderText('firstName'))
  await userEvent.clear(getByPlaceholderText('lastName'))

  expect(getByTestId('error-email').innerHTML).toEqual('Email is required')
  expect(getByTestId('error-firstName').innerHTML).toEqual(
    'First name is required',
  )
  expect(getByTestId('error-lastName').innerHTML).toEqual(
    'Last name is required',
  )

  await userEvent.type(getByPlaceholderText('email'), 'e@mail.com')
  await userEvent.type(getByPlaceholderText('firstName'), 'John')
  await userEvent.type(getByPlaceholderText('lastName'), 'Doe')

  expect(getByTestId('error-email').innerHTML).toBeFalsy()
  expect(getByTestId('error-firstName').innerHTML).toBeFalsy()
  expect(getByTestId('error-lastName').innerHTML).toBeFalsy()
})

test('invokes the submit function when the form is submitted', async () => {
  const { getByPlaceholderText, getByRole } = render(Form)

  expect(getByRole('heading', { level: 1 }).innerHTML).toEqual('Register')

  await userEvent.type(getByPlaceholderText('email'), 'e@mail.com')
  await userEvent.type(getByPlaceholderText('firstName'), 'John')
  await userEvent.type(getByPlaceholderText('lastName'), 'Doe')

  await userEvent.click(getByRole('button'))

  expect(getByRole('heading', { level: 1 }).innerHTML).toEqual('Success!')
})

test('invokes the submit function and shows the error if it throws', async () => {
  const { getByPlaceholderText, getByRole } = render(Form)

  expect(getByRole('heading', { level: 1 }).innerHTML).toEqual('Register')

  await userEvent.type(getByPlaceholderText('email'), 'invalid@email.com')
  await userEvent.type(getByPlaceholderText('firstName'), 'John')
  await userEvent.type(getByPlaceholderText('lastName'), 'Doe')

  await userEvent.click(getByRole('button'))

  expect(getByRole('heading', { level: 1 }).innerHTML).toEqual('Register')
  expect(getByRole('alert').innerHTML).toEqual(
    'This email is already registered',
  )
})
