<!-- Enhanced Card Component with Collapsible Option -->
<script lang="ts">
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
    <div class="flex items-center justify-between {paddings[padding]} {collapsible && isExpanded ? 'pb-4' : collapsible ? 'pb-4' : ''}">
      <button
        onclick={toggleExpanded}
        disabled={!collapsible}
        class="flex items-center gap-2 {collapsible ? '-m-2 p-2 rounded-lg transition-colors cursor-pointer' : 'cursor-default'} flex-1"
      >
        {#if icon}
          <Icon name={icon} class={iconColor} />
        {/if}
        <h2 class="text-lg font-semibold text-gray-900">{title}</h2>
        
        {#if collapsible}
          <Icon 
            name={isExpanded ? "close" : "plus"} 
            class="text-gray-500 transition-transform duration-200 {isExpanded ? 'rotate-45' : ''} ml-auto" 
            size="sm" 
          />
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
      <div class="px-4 pb-2">
        {@render headerAction()}
      </div>
    {/if}
  {/if}
  
  <!-- Content Section -->
  {#if !collapsible || isExpanded}
    <div class="{title ? (collapsible ? 'px-4 pb-4' : 'pt-0 ' + paddings[padding]) : paddings[padding]}">
      {@render children()}
    </div>
  {/if}
</section>