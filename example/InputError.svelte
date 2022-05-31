<script lang="ts">
  import { getVestContext } from '../src/index'

  // The name of the field.
  export let name: string

  // All we're interested in here from the context, is the actual Vest
  // validation result.
  const { result } = getVestContext()

  // getErrors() returns all errors for all fields. If there are any errors for
  // a specific field, then it will be in the object as an Array of errors.
  $: errors = $result.getErrors()[name]
</script>

<small data-testid={`error-${name}`}>
  {#if errors}
    <!--
			There is no need to display all errors since normally the first
			error is the most important one (like that this field is required)
		-->
    {errors[0]}
  {/if}
</small>

<style>
  small {
    display: block;
    color: red;
    margin: 0.5em 0;
  }
</style>
