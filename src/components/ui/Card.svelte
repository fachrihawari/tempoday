<!-- Enhanced Card Component with Smooth Collapsible Animation -->
<script lang="ts">
import { slide } from 'svelte/transition';
import Icon, { type IconName } from './Icon.svelte';

interface Props {
  title?: string;
  icon?: IconName;
  iconColor?: string;
  padding?: 'sm' | 'md' | 'lg';
  class?: string;
  children: any;
  headerAction?: any;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

let {
  title = '',
  icon,
  iconColor = 'text-gray-500',
  padding = 'md',
  class: className = '',
  children,
  headerAction,
  collapsible = false,
  defaultExpanded = true,
  onToggle,
}: Props = $props();

let isExpanded = $state(defaultExpanded);

const paddings = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

function toggleExpanded() {
  if (!collapsible) return;

  isExpanded = !isExpanded;
  onToggle?.(isExpanded);
}
</script>

<section class="bg-white border-b border-gray-200 {className}">
  {#if title}
    <!-- Header Section -->
    <div class="flex items-center justify-between pb-4 {paddings[padding]}">
      <button
        onclick={toggleExpanded}
        disabled={!collapsible}
        class="flex items-center gap-2 {collapsible ? 'py-1 rounded-lg transition-all duration-200 cursor-pointer' : 'cursor-default'} flex-1"
      >
        {#if icon}
          <Icon name={icon} class={iconColor} />
        {/if}
        <h2 class="text-lg font-semibold text-gray-900">{title}</h2>
        
        {#if collapsible}
          <div class="ml-auto transition-transform duration-300 ease-in-out {isExpanded ? 'rotate-180' : 'rotate-0'}">
            <Icon 
              name="chevron-down" 
              class="text-gray-500" 
              size="sm" 
            />
          </div>
        {/if}
      </button>
      
      {#if headerAction && !collapsible}
        <div class="ml-4">
          {@render headerAction()}
        </div>
      {/if}
    </div>
    
    <!-- Header Action for Collapsible (when expanded) -->
    {#if headerAction && collapsible && isExpanded}
      <div class="px-4 pb-2" transition:slide={{ duration: 200 }}>
        {@render headerAction()}
      </div>
    {/if}
  {/if}
  
  <!-- Content Section with Smooth Animation -->
  {#if !collapsible || isExpanded}
    <div 
      class="{title ? (collapsible ? 'px-4 pb-4' : 'pt-0 ' + paddings[padding]) : paddings[padding]}"
      transition:slide={{ duration: 300, axis: 'y' }}
    >
      {@render children()}
    </div>
  {/if}
</section>