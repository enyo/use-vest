<script lang="ts">
  import { getVestContext } from '../../src/index'
  import InputError from './InputError.svelte'

  export let name: string

  const { data, updateField, submitting } = getVestContext()

  $: value = $data[name]

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

<InputError {name} />

<!--
  Of course you might want more control over the input, or use a third party
  UI library altogether. Just expose any values that you might want and build
  your input field the way you want it to.
-->
<input disabled={$submitting} placeholder={name} {value} on:input={update} />
