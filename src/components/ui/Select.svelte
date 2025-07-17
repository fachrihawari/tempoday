<script lang="ts">
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

const selectId = id || (label ? `select-${label}` : undefined);

const currentConfig = $derived(
  options.find((option) => option.value === value) || {
    label: placeholder || 'Select...',
    icon: '',
    color: 'text-gray-900 dark:text-gray-100',
    bgColor: 'bg-white dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600',
  },
);

const selectClasses = $derived.by(() => {
  return `
    w-full rounded-lg border ${currentConfig.borderColor} ${currentConfig.bgColor} ${currentConfig.color} transition-colors
    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400
    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700' : 'hover:border-gray-400 dark:hover:border-gray-500'}
    ${compact ? 'px-2 py-1 text-xs h-6' : 'px-3 py-2 text-sm h-10'}
  `;
});
</script>

<div class="select-wrapper {className}">
  {#if label}
    <label
      for={selectId}
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {label}
    </label>
  {/if}

  <select
    id={selectId}
    bind:value
    {disabled}
    onchange={() => {
      if (onSelect) {
        onSelect(value);
      }
    }}
    class={selectClasses}
  >
    {#if placeholder}
      <option value="" disabled selected={!value}>
        {placeholder}
      </option>
    {/if}
    {#each options as option (option.value)}
      <option value={option.value}>
        {#if option.icon}{option.icon}{'  '}{/if}{option.label}{#if option.description}{' - '}{option.description}{/if}
      </option>
    {/each}
  </select>
</div>
