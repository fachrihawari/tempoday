<script lang="ts">
import {
  type TransactionCategory,
  getCategoriesForType,
  getCategoryConfig,
} from '../../lib/categories';
import Select from '../ui/Select.svelte';

interface Props {
  value: TransactionCategory | '';
  transactionType: 'income' | 'expense';
  onSelect?: (category: TransactionCategory) => void;
  disabled?: boolean;
  class?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  compact?: boolean;
}

let {
  value = $bindable(''),
  transactionType,
  onSelect,
  disabled = false,
  class: className = '',
  id,
  label,
  compact = false,
  placeholder = 'Select category...',
}: Props = $props();

const categoryOptions = $derived(
  getCategoriesForType(transactionType).map((category) => {
    const config = getCategoryConfig(category);
    return {
      value: category,
      label: config.label,
      icon: config.icon,
      color: config.color,
      bgColor: config.bgColor,
      borderColor: config.borderColor,
    };
  }),
);

function handleSelect(selectedValue: string) {
  onSelect?.(selectedValue as TransactionCategory);
}
</script>

<Select
  bind:value
  options={categoryOptions}
  onSelect={handleSelect}
  {disabled}
  class={className}
  {id}
  {compact}
  {label}
  {placeholder}
/>