import type { FormData } from './test-suite'

export const submitData = async (data: FormData) => {
  // This is a fake implementation that pretends that this email address is
  // already registered.
  if (data.email === 'invalid@email.com') {
    throw 'This email is already registered'
  }
}
