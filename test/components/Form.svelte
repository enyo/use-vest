<script lang="ts">
  import { useVest } from '../../src/index'
  import { suite, initialData } from './test-suite'
  import type { FormData } from './test-suite'
  import Input from './Input.svelte'

  let success = false

  const { action, error, disabled } = useVest<FormData>(
    suite,
    initialData,
    async (data) => {
      // PSEUDO CODE HERE
      // This is where you would be submitting your data.
      // Any exception thrown here will udate the $error store.
      alert(`Submitting: ${JSON.stringify(data)}`)
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))
      await delay(500)
      success = true
    },
  )
</script>

{#if success}
  <h1>Success!</h1>
{:else}
  <form use:action>
    <h1>Register</h1>
    {#if $error}<h3 class="error">{$error}</h3>{/if}

    <Input name="email" />
    <Input name="firstName" />
    <Input name="lastName" />

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
