<script lang="ts">
  // In your app you must import it like this:
  // import { getVestContext } from 'use-vest'
  import { getVestContext } from '../src/index'
  import InputError from './InputError.svelte'

  // In this simple example, we only expose the name of the field. In a more
  // realistic example, you'd also accept a placeholder, a type, and anything
  // else you'd need to display a nice input field.
  export let name: string

  // This is where the magic happens. The vest context contains the data (which
  // is the current representation of your form data) and ways to update a field
  // (so it gets validated as well).
  // The `submitting` store can be used to disable the field when the form is
  // being submitted.
  const { data, updateField, submitting } = getVestContext()

  // We make sure that the value of the input field is updated whenever the
  // actual form data changes.
  $: value = $data[name]

  // The update function that is invoked when the input field is changed.
  const update = (
    e: Event & {
      currentTarget: EventTarget & (HTMLInputElement | HTMLTextAreaElement)
    },
  ) => {
    // This is a good place to convert the input field value to another type
    // (like a number) if that's what your data is expecting.
    updateField(name, e.currentTarget.value)
  }
</script>

<!--
  All error output is abstracted in the InputError component to keep the
  individual components simple.
-->
<InputError {name} />

<!--
  Of course you might want more control over the input, or use a third party
  UI library altogether. Just expose any values that you might want and build
  your input field the way you want it to.

  If you want the validation to be a bit delayed or only occur after the user
  edited the field, take a look at this discussion:

  https://github.com/enyo/use-vest/discussions/2
-->
<input disabled={$submitting} placeholder={name} {value} on:input={update} />
