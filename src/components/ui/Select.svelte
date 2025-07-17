<script lang="ts">
import { getPriorityConfig } from '../../lib/priority';

interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  color?: string;
  bgColor?: string;
  borderColor?: string;
}

interface Props {
  value: string;
  options: SelectOption[];
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  label?: string;
  placeholder?: string;
  id?: string;
  onSelect?: (value: string) => void;
}

let {
  value = $bindable(),
  options,
  disabled = false,
  size = 'md',
  class: className = '',
  label,
  placeholder,
  id,
  onSelect,
}: Props = $props();

const selectSizes = {
  sm: 'px-2 py-1 text-xs h-8',
  md: 'px-3 py-1.5 text-sm h-10',
  lg: 'px-4 py-2 text-base h-12',
};

const selectId = id || (label ? `select-${label}` : undefined);

const currentConfig = $derived(
  options.find((option) => option.value === value) || {
    label: '',
    icon: '',
    color: 'text-gray-900',
    bgColor: 'bg-white',
    borderColor: 'border-gray-300',
  },
);

const classList = $derived.by(() => {
  return `
    w-full rounded-lg border ${currentConfig.borderColor} ${currentConfig.bgColor} ${currentConfig.color} transition-colors ${selectSizes[size]}
    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400
    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700' : 'hover:border-gray-400 dark:hover:border-gray-500'}
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
    class={classList}
  >
    {#if placeholder}
      <option value="" disabled selected={!value}>
        {placeholder}
      </option>
    {/if}
    {#each options as option (option.value)}
      <option value={option.value}>
        {#if option.icon}{option.icon}&nbsp;&nbsp;{/if}{option.label}
      </option>
    {/each}
  </select>
</div>
