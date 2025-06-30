<script lang="ts">
import { onMount } from 'svelte';
import Icon from './Icon.svelte';

interface Option {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface Props {
  options: Option[];
  value: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
  onSelect: (value: string) => void;
  horizontalScroll?: boolean; // New prop to enable horizontal scrolling
}

let {
  options,
  value,
  placeholder = 'Select option...',
  disabled = false,
  class: className = '',
  onSelect,
  horizontalScroll = false,
}: Props = $props();

let isOpen = $state(false);
let triggerElement: HTMLButtonElement = $state()!;
let portalContainer: HTMLDivElement | null = null;

// Get selected option
const selectedOption = $derived(options.find(opt => opt.value === value));

// Toggle dropdown
function toggleDropdown() {
  if (disabled) return;
  isOpen = !isOpen;
}

// Close dropdown
function closeDropdown() {
  isOpen = false;
}

// Handle option selection
function handleSelect(optionValue: string) {
  if (disabled) return;
  onSelect(optionValue);
  closeDropdown();
}

// Handle click outside to close dropdown
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Element;
  if (!triggerElement?.contains(target) && !portalContainer?.contains(target)) {
    closeDropdown();
  }
}

// Handle escape key to close dropdown
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeDropdown();
  }
}

// Create and position dropdown portal
function createDropdownPortal() {
  if (!isOpen || !triggerElement) return;

  // Remove existing portal
  if (portalContainer) {
    document.body.removeChild(portalContainer);
    portalContainer = null;
  }

  // Create new portal container
  portalContainer = document.createElement('div');
  portalContainer.style.position = 'absolute';
  portalContainer.style.zIndex = '9999';
  document.body.appendChild(portalContainer);

  // Position the portal
  positionDropdown();
}

// Position dropdown precisely below the trigger
function positionDropdown() {
  if (!isOpen || !portalContainer || !triggerElement) return;

  const triggerRect = triggerElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  // Calculate available space below and above
  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;

  // Determine if dropdown should open upward or downward
  const shouldOpenUpward = spaceBelow < 200 && spaceAbove > spaceBelow;

  // Calculate precise positioning
  let top: number;
  let left: number;
  let width: number;

  if (shouldOpenUpward) {
    // Position above the trigger with 2px gap
    top = triggerRect.top + scrollY - 2;
    portalContainer.style.transform = 'translateY(-100%)';
  } else {
    // Position below the trigger with 2px gap
    top = triggerRect.bottom + scrollY + 2;
    portalContainer.style.transform = 'translateY(0)';
  }

  // Horizontal positioning
  left = triggerRect.left + scrollX;
  
  if (horizontalScroll) {
    // For horizontal scroll mode, make dropdown wider
    const maxWidth = Math.min(viewportWidth - 32, 400);
    const minWidth = Math.max(triggerRect.width, 280);
    width = Math.min(maxWidth, minWidth);
    
    // Ensure dropdown doesn't go off-screen to the right
    if (left + width > viewportWidth + scrollX - 16) {
      left = viewportWidth + scrollX - width - 16;
    }
    
    // Ensure dropdown doesn't go off-screen to the left
    if (left < scrollX + 16) {
      left = scrollX + 16;
    }
  } else {
    // Standard positioning - match trigger width
    width = triggerRect.width;
    
    // Ensure dropdown doesn't go off-screen to the right
    if (left + width > viewportWidth + scrollX - 8) {
      left = viewportWidth + scrollX - width - 8;
    }
  }

  // Apply positioning
  portalContainer.style.top = `${top}px`;
  portalContainer.style.left = `${left}px`;
  portalContainer.style.width = `${width}px`;
}

// Cleanup portal when component unmounts
function cleanupPortal() {
  if (portalContainer && document.body.contains(portalContainer)) {
    document.body.removeChild(portalContainer);
    portalContainer = null;
  }
}

// Setup event listeners and positioning
$effect(() => {
  if (isOpen) {
    // Create portal and position dropdown
    createDropdownPortal();
    
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);
    
    // Reposition on scroll/resize
    const handleReposition = () => {
      if (isOpen) {
        positionDropdown();
      }
    };
    
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
      cleanupPortal();
    };
  } else {
    // Clean up portal when closed
    cleanupPortal();
  }
});

// Cleanup on unmount
onMount(() => {
  return () => {
    cleanupPortal();
  };
});
</script>

<div class="relative {className}">
  <!-- Trigger Button -->
  <button
    bind:this={triggerElement}
    onclick={toggleDropdown}
    {disabled}
    class="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
      {disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
      {isOpen ? 'border-blue-500 ring-2 ring-blue-500' : ''}"
  >
    <div class="flex items-center gap-2 flex-1 min-w-0">
      {#if selectedOption}
        {#if selectedOption.icon}
          <span class="text-sm">{selectedOption.icon}</span>
        {/if}
        <span class="truncate">{selectedOption.label}</span>
      {:else}
        <span class="text-gray-500 truncate">{placeholder}</span>
      {/if}
    </div>
    
    <Icon 
      name="chevron-down" 
      size="sm" 
      class="text-gray-400 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" 
    />
  </button>
</div>

<!-- Dropdown content will be rendered in the portal -->
{#if isOpen && portalContainer}
  {@render dropdownContent()}
{/if}

{#snippet dropdownContent()}
  <div
    class="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden"
    style="min-width: 200px;"
  >
    {#if horizontalScroll}
      <!-- Horizontal scrollable layout -->
      <div class="p-2">
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {#each options as option (option.value)}
            <button
              onclick={() => handleSelect(option.value)}
              disabled={option.disabled}
              class="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors whitespace-nowrap
                {option.value === value 
                  ? 'bg-blue-100 border-blue-300 text-blue-700' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'}
                {option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
            >
              {#if option.icon}
                <span class="text-sm">{option.icon}</span>
              {/if}
              <span class="text-sm font-medium">{option.label}</span>
              {#if option.value === value}
                <Icon name="check" size="sm" class="text-blue-600" />
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Vertical layout -->
      <div class="py-1 overflow-y-auto max-h-56">
        {#each options as option (option.value)}
          <button
            onclick={() => handleSelect(option.value)}
            disabled={option.disabled}
            class="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2
              {option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
              {option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
          >
            {#if option.icon}
              <span class="text-sm">{option.icon}</span>
            {/if}
            <span class="flex-1 truncate">{option.label}</span>
            {#if option.value === value}
              <Icon name="check" size="sm" class="text-blue-600" />
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

<style>
  /* Custom scrollbar styles for horizontal scroll */
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  
  .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 4px;
  }
  
  .scrollbar-track-gray-100::-webkit-scrollbar-track {
    background-color: #f3f4f6;
    border-radius: 4px;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    height: 6px;
  }
</style>