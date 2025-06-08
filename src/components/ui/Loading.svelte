<script lang="ts">
import Icon, { type IconSize } from './Icon.svelte';

interface Props {
  class?: string;
  message?: string;
  size?: IconSize;
}

let {
  message = 'Loading...',
  class: className = '',
  size = 'md',
}: Props = $props();
</script>

<div class="flex flex-col items-center justify-center p-4 {className}">
  <Icon name='loader' class="animate-spin"  size={size}/>

  <p class="mt-4 text-gray-600">{message}</p>
</div>
