# A Svelte action for Vest

Vest, in their own words is a "Declarative validations framework inspired by
unit testing libraries".

This svelte action aims to make it easy to use vest in your svelte forms to
validate your data and show errors. It will also wrap your call that submits the
data to your server and handle any errors that might happen there as well.

## Installation

```bash
npm install --save-prod use-vest
# or pnpmpnp
pnpm add use-vest
# or whatever package manager you like
```

## How it works

Before going to the usage section, a short description of how `use-vest` works:

In your svelte component that handles the form, you invoke `useVest(...)` with
your vest suite and other necessary options. You will then get back the actual
`action` that you can use on your form (`<form use:action>`) as well as a few
Svelte (readable) stores that you can use to disable the form or show errors or
success messages.

The `useVest()` function will _also_ create a Svelte context for you, that you
can read in your field components to update the values as well as disable fields
or display errors.

## Usage

Here's how you use the action in your project:

```html
<script lang="ts">
  import { getVestContext, useVest } from 'use-vest'
  import { suite, type FormData } from '$lib/form-suites/registration'

  let success = false
  const initialData: FormData = { name: '', password: '', email: '' }
  const { action, error, disabled } = useVest<FormData>(
    suite,
    initialData,
    async (data) => {
      await submitRegisrationData(data)
      success = true
    },
  )

  const { result } = getVestContext()
</script>

<form use:action>
  <!-- WIP -->
</form>
```
