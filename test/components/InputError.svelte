<script lang="ts">
  import { getVestContext } from '../../src/index'

  export let name: string

  const { result } = getVestContext()

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
