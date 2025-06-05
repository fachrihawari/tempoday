<!-- Reusable List Item Component -->
<script lang="ts">
import Button from './Button.svelte';
import Icon from './Icon.svelte';

interface Props {
  class?: string;
  children: any;
  actions?: any;
  onClick?: () => void;
}

let { class: className = '', children, actions, onClick }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group {className}"
  onclick={onClick}
>
  {@render children()}
  
  {#if actions}
    <div class="flex items-center gap-1">
      {@render actions()}
    </div>
  {/if}
</div>
