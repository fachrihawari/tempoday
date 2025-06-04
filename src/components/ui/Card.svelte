<!-- Reusable Card Component -->
<script lang="ts">
  import Icon from './Icon.svelte';
  
  interface Props {
    title?: string;
    icon?: 'check' | 'trash' | 'settings' | 'plus' | 'close' | 'dollar' | 'clipboard' | 'edit';
    iconColor?: string;
    padding?: 'sm' | 'md' | 'lg';
    class?: string;
    children: any;
    headerAction?: any;
  }

  let { 
    title = '',
    icon,
    iconColor = 'text-gray-500',
    padding = 'md',
    class: className = '',
    children,
    headerAction
  }: Props = $props();

  const paddings = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
</script>

<section class="bg-white rounded-lg border border-gray-200 {paddings[padding]} {className}">
  {#if title}
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        {#if icon}
          <Icon name={icon} class={iconColor} />
        {/if}
        {title}
      </h2>
      {#if headerAction}
        {@render headerAction()}
      {/if}
    </div>
  {/if}
  
  {@render children()}
</section>
