<script lang="ts">
import Button from './Button.svelte';
import Icon, { type IconName } from './Icon.svelte';

interface Props {
  title: string;
  subtitle?: string;
  icon?: IconName;
  children?: any;
  onBack?: (() => void) | null;
}

let { title, subtitle, icon, children, onBack = null }: Props = $props();
</script>

<div class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
  <div class="flex items-center justify-between p-4">
    <div class="flex items-center gap-3">
      {#if onBack}
        <Button
          onclick={onBack}
          variant="ghost"
          aria-label="Go back"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mr-1"
        >
          <Icon name="chevron-left" class="text-gray-600 dark:text-gray-300" />
        </Button>
      {/if}
      {#if icon}
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-xl flex items-center justify-center">
          <Icon name={icon} class="text-white" />
        </div>
      {/if}
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        {#if subtitle}
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
        {/if}
      </div>
    </div>
    
    {#if children}
      <div class="flex items-center gap-2">
        {@render children()}
      </div>
    {/if}
  </div>
</div>