<!-- Reusable EmptyState Component -->
<script lang="ts">
import Icon, { type IconName } from './Icon.svelte';

interface Props {
  icon: IconName;
  title: string;
  subtitle: string;
  onclick?: () => void;
  class?: string;
}

let { icon, title, subtitle, onclick, class: className = '' }: Props = $props();
</script>

<button
  {onclick}
  class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors text-center w-full cursor-pointer {className}"
>
  <Icon name={icon} size="sm" class="mx-auto mb-2 text-gray-400 dark:text-gray-500" />
  <p class="text-sm text-gray-500 dark:text-gray-400">{title}</p>
  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
</button>
