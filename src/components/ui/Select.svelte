<script lang="ts">
import Icon from './Icon.svelte';

interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
  color?: string;
  bgColor?: string;
  borderColor?: string;
}

interface Props {
  value: string;
  options: SelectOption[];
  disabled?: boolean;
  class?: string;
  label?: string;
  placeholder?: string;
  id?: string;
  onSelect?: (value: string) => void;
  compact?: boolean;
}

let {
  value = $bindable(),
  options,
  disabled = false,
  class: className = '',
  label,
  placeholder,
  id,
  onSelect,
  compact = false,
}: Props = $props();

// State for custom dropdown
let isOpen = $state(false);
let dropdownElement = $state<HTMLDivElement | null>(null);
let buttonElement = $state<HTMLButtonElement | null>(null);
let shouldFlipUp = $state(false);

const selectId = id || (label ? `select-${label}` : undefined);

const currentConfig = $derived(
  options.find((option) => option.value === value) || {
    label: placeholder || 'Select...',
    icon: '',
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-white dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600',
  },
);

const buttonClasses = $derived.by(() => {
  const hasValue = value && value !== '';
  return `
    w-full inline-flex items-center justify-between gap-2 rounded-lg border transition-colors
    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400
    ${hasValue ? `${currentConfig.borderColor} ${currentConfig.bgColor} ${currentConfig.color}` : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}
    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700' : 'hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer'}
    ${compact ? 'px-2 py-1 text-xs h-6' : 'px-3 py-2 text-sm h-10'}
  `;
});

function handleSelect(selectedValue: string) {
  value = selectedValue;
  onSelect?.(selectedValue);
  isOpen = false;
}

function toggleOpen(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  if (!disabled) {
    isOpen = !isOpen;

    if (isOpen && buttonElement) {
      $effect.root(() => {
        setTimeout(() => {
          calculateDropdownPosition();
        }, 0);
      });
    }
  }
}

function calculateDropdownPosition() {
  if (!buttonElement) return;

  const buttonRect = buttonElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const dropdownHeight = dropdownElement?.offsetHeight || 300;

  const isInModal = buttonElement.closest('[role="dialog"]') !== null;
  const buffer = isInModal ? 20 : 10;
  const spaceBelow = viewportHeight - buttonRect.bottom - buffer;
  const spaceAbove = buttonRect.top - buffer;

  if (isInModal) {
    shouldFlipUp = spaceBelow < dropdownHeight * 0.8 && spaceAbove > spaceBelow;
  } else {
    shouldFlipUp = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Element;
  if (!target.closest('.custom-select')) {
    isOpen = false;
    shouldFlipUp = false;
  }
}

$effect(() => {
  if (isOpen) {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', calculateDropdownPosition);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', calculateDropdownPosition);
    };
  } else {
    shouldFlipUp = false;
  }
});
</script>

<div class="custom-select {className}">
  {#if label}
    <label
      for={selectId}
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {label}
    </label>
  {/if}

  <div class="relative">
    <!-- Custom Select Button -->
    <button
      bind:this={buttonElement}
      type="button"
      id={selectId}
      onclick={toggleOpen}
      {disabled}
      class={buttonClasses}
    >
      <div class="flex items-center gap-2 min-w-0">
        {#if currentConfig.icon}
          <span class="text-sm flex-shrink-0">{currentConfig.icon}</span>
        {/if}
        <span class="font-medium truncate">
          {currentConfig.label}
        </span>
      </div>
      {#if !disabled}
        <Icon 
          name="chevron-down" 
          size="sm" 
          class="transition-transform duration-200 flex-shrink-0 {isOpen ? 'rotate-180' : ''}" 
        />
      {/if}
    </button>

    <!-- Dropdown Options -->
    {#if isOpen && !disabled}
      <div 
        bind:this={dropdownElement}
        class="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg dark:shadow-gray-900/20 z-[200] transition-all duration-200 min-w-32 w-full {shouldFlipUp ? 'bottom-full mb-1' : 'top-full mt-1'}"
      >
        <div class="py-1 max-h-64 overflow-y-auto">
          {#each options as option (option.value)}
            <button
              type="button"
              onclick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleSelect(option.value);
              }}
              class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-start gap-3
                     {option.value === value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}"
            >
              {#if option.icon}
                <span class="text-lg flex-shrink-0 mt-0.5">{option.icon}</span>
              {/if}
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm">{option.label}</div>
                {#if option.description}
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.description}</div>
                {/if}
              </div>
              {#if option.value === value}
                <Icon name="check" size="sm" class="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
