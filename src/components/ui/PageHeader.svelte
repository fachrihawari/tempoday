<script lang="ts">
import Icon from './Icon.svelte';

interface Props {
  title: string;
  subtitle?: string;
  icon?: 'home' | 'calendar' | 'settings' | 'check' | 'trash' | 'plus' | 'close' | 'dollar' | 'clipboard' | 'edit';
  iconColor?: string;
  children?: any;
}

let {
  title,
  subtitle,
  icon,
  iconColor = 'text-blue-500',
  children,
}: Props = $props();
</script>

<div class="bg-white shadow-sm border-b border-gray-200">
  <div class="flex items-center justify-between p-4">
    <div class="flex items-center gap-3">
      {#if icon}
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Icon name={icon} class="text-white" />
        </div>
      {/if}
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{title}</h1>
        {#if subtitle}
          <p class="text-sm text-gray-600 mt-1">{subtitle}</p>
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