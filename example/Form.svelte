<script lang="ts">
  // In your app you must import it like this:
  // import { useVest } from 'use-vest'
  import { useVest } from '../src/index'

  // Import everything about our vest suite.
  import { suite, initialData, type FormData } from './test-suite'

  // The actual Input field that will also show the individual errors.
  import Input from './Input.svelte'

  // A fake submit implementation
  import { submitData } from './submit'

  let success = false

  const { action, error, disabled } = useVest<FormData>(suite, {
    initialData,
    submit: async (data) => {
      // This is the submit function, that will be invoked when the form is
      // submitted. If an exception is thrown here, `use-vest` will catch it
      // for you, and update the `$error` store.

      await submitData(data)

      success = true
    },
  })
</script>

{#if success}
  <h1>Success!</h1>
{:else}
  <form use:action>
    <h1>Register</h1>

    {#if $error}
      <!--
        This might be an error that occurred during the submission of the
        form. This will not contain any field validation errors.
      -->
      <h3 role="alert" class="error">{$error}</h3>
    {/if}

    <!-- The individual input fields. -->
    <Input name="email" />
    <Input name="firstName" />
    <Input name="lastName" />

    <!--
      The submit button is automatically disabled when the validation does not
      pass or the form is being submitted.
    -->
    <button disabled={$disabled}>Submit</button>
  </form>
{/if}

<style>
  .error {
    color: red;
  }
  button {
    display: block;
    margin: 1.5em 0;
  }
  button:not([disabled]) {
    background: #008800;
    color: white;
  }
</style>
