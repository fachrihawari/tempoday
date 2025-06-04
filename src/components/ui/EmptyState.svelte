<!-- Reusable EmptyState Component -->
<script lang="ts">
  import Icon from "./Icon.svelte";
  
  interface Props {
    icon: 'check' | 'trash' | 'settings' | 'plus' | 'close' | 'dollar' | 'clipboard' | 'edit';
    title: string;
    subtitle: string;
    onclick?: () => void;
    class?: string;
  }

  let { 
    icon, 
    title, 
    subtitle, 
    onclick,
    class: className = ''
  }: Props = $props();
</script>

<button
  {onclick}
  class="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors text-center w-full cursor-pointer {className}"
>
  <Icon name={icon} size="sm" class="mx-auto mb-2 text-gray-400" />
  <p class="text-sm text-gray-500">{title}</p>
  <p class="text-xs text-gray-400 mt-1">{subtitle}</p>
</button>
